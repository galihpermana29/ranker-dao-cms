import { useEffect, useState } from 'react';

import { message } from 'antd';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

import { hasDuplicates } from '@/utils';
import {
  checkContractAddressName,
  gettingTheContractMetaData,
  mappingAddress,
} from '@/utils/collectionsUtils';
import contractAbi from '@/utils/contract-abi-approval.json';

export const useCreateCollection = (
  setContractMetadataError,
  hittingAPICollection
) => {
  const [approvalAddress, setApprovalAddress] = useState({
    address: '',
  });

  const { config } = usePrepareContractWrite({
    address: approvalAddress.address,
    abi: contractAbi,
    functionName: 'setApprovalForAll',
    args: [
      import.meta.env.VITE_LISTING_CONTRACT, // address of listing
      true, // boolean
    ],
  });

  const {
    write: setApprovalForAll,
    isLoading,
    isSuccess,
  } = useContractWrite(config);

  const handleCreateCollections = async (value, isNew = true) => {
    try {
      const { fields = [], game } = value;
      if (fields.length === 0) {
        return setContractMetadataError('Contract is required');
      }

      if (hasDuplicates(fields)) {
        return setContractMetadataError(
          'You are not allowed to input the same address'
        );
      }

      const payloadForGettingTheContractName = mappingAddress(
        fields,
        setContractMetadataError
      );
      if (payloadForGettingTheContractName) {
        const responsesFromAlchemy = await gettingTheContractMetaData(
          payloadForGettingTheContractName
        );

        const payload = responsesFromAlchemy.map((d) => ({
          name: checkContractAddressName(d.name),
          address: d.address,
          gameId: game,
        }));

        fields.forEach((data, idx) => {
          setTimeout(() => {
            setApprovalAddress((approvalAddress) => ({
              address: data.name,
            }));
          }, 1000 * idx + idx * 2);
        });

        try {
          if (isNew) await hittingAPICollection(payload);
        } catch (error) {
          return error;
        }
      }
    } catch (error) {
      setContractMetadataError('Error approval contract collection');
    }
  };

  const interactApproval = async () => {
    try {
      setApprovalForAll?.();
    } catch (error) {
      console.log(error, 'error');
      message.error('Blockchain approval function error, try again!');
    }
  };

  useEffect(() => {
    if (approvalAddress.address !== '') {
      interactApproval();
    }
  }, [approvalAddress]);

  useEffect(() => {
    if (isSuccess) message.loading('Permission to this collection has granted');
  }, [isLoading]);

  useEffect(() => {
    if (isLoading)
      message.loading(
        'Waiting for adding permission to the collection address'
      );
  }, [isLoading]);

  return { handleCreateCollections };
};
