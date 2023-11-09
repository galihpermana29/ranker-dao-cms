import { useEffect } from 'react';

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
  const { config } = usePrepareContractWrite({
    address: '0x10b8b56d53bfa5e374f38e6c0830bad4ebee33e6',
    abi: contractAbi,
    functionName: 'setApprovalForAll',
    args: [
      import.meta.env.VITE_LISTING_CONTRACT, // address of listing
      true, // boolean
    ],
  });

  const {
    writeAsync: setApprovalForAll,
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
        const allAsyncApproval = fields.map((data) =>
          setApprovalForAll({
            address: data.name,
            abi: contractAbi,
            functionName: 'setApprovalForAll',
            args: [
              import.meta.env.VITE_LISTING_CONTRACT, // address of listing
              true, // boolean approve
            ],
          })
        );

        try {
          await Promise.all(allAsyncApproval);

          const responsesFromAlchemy = await gettingTheContractMetaData(
            payloadForGettingTheContractName
          );

          const payload = responsesFromAlchemy.map((d) => ({
            name: checkContractAddressName(d.name),
            address: d.address,
            gameId: game,
          }));

          if (isNew) await hittingAPICollection(payload);
        } catch (error) {
          return error;
        }
      }
    } catch (error) {
      setContractMetadataError('Error approval contract collection');
    }
  };

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
