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
      '0xb735c8D829B40D4C6203ed6539D23Ee13c25e73e', // address of listing
      true, // boolean
    ],
  });

  const { writeAsync: setApprovalForAll } = useContractWrite(config);

  const handleCreateCollections = async (value) => {
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
              '0xb735c8D829B40D4C6203ed6539D23Ee13c25e73e', // address of listing
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
          await hittingAPICollection(payload);
        } catch (error) {
          return error;
        }
      }
    } catch (error) {
      setContractMetadataError('Error approval contract collection');
    }
  };

  return { handleCreateCollections };
};
