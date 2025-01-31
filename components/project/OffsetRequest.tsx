/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  cn,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { useContract, useSendTransaction } from "@starknet-react/core";
import Button from '../common/Button';
import { formatDecimal } from "@/utils/starknet";
import { ProjectWithAbi } from "@/config/projects";
import { useProjects } from "@/providers/ProjectsProvider";

interface OffsetModalProps {
  vintage: bigint;
  maxAmount: bigint | number;
  decimals: number;
  buttonDisabled: boolean;
  project: ProjectWithAbi;
  setDisplayAlert: (value: boolean) => void;
  setTxHash: (message: string) => void;
  refetchOffsettor: () => void;
  refetchVintages: () => void;
}

export default function OffsetRequestModal({ vintage, maxAmount, buttonDisabled, decimals, project, setTxHash, setDisplayAlert, refetchOffsettor, refetchVintages }: OffsetModalProps) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [amount, setAmount] = useState<string>('');
  const [displayedAmount, setDisplayedAmount] = useState<string>('');
  const { refreshUserData } = useProjects();

  const { contract: approvalContract } = useContract({
    abi: project.abi,
    address: project.project as `0x${string}`,
  });

  const { contract: offsetContract } = useContract({
    abi: project.offsettorAbi,
    address: project.offsettor as `0x${string}`,
  });

  const [calls, setCalls] = useState<any[]>([]);

  useEffect(() => {
    if (approvalContract && offsetContract) {
      const projectAddress = project.project as `0x${string}`;
      const amountU256 = BigInt(amount);
      const vintageU256 = BigInt(vintage);

      const preparedCalls = [
        approvalContract.populate('set_approval_for_all', [offsetContract.address, true]),
        offsetContract.populate('request_offset', [projectAddress, amountU256, vintageU256]),
        approvalContract.populate('set_approval_for_all', [offsetContract.address, false]),
      ];

      setCalls(preparedCalls);
    }
  }, [approvalContract, offsetContract, amount, vintage, project.project]);

  const { sendAsync, data } = useSendTransaction({
    calls: calls.length > 0 ? calls : undefined,
  });

  const handleRequest = async () => {
    if (calls.length === 0) {
      console.error('Transaction calls are not prepared');
      return;
    }

    try {
      await sendAsync();
      console.log('Multicall transaction sent successfully');
    } catch (err) {
      console.error('Error sending multicall transaction:', err);
    }
  };

  useEffect(() => {
    if (data) {
      const txHash = data.transaction_hash;
      setTxHash(txHash);
      setDisplayAlert(true);
      refreshUserData();
      refetchOffsettor();
      refetchVintages();
      onClose();
    }
  }, [data]);

  const handleMaxAmount = () => {
    setAmount(maxAmount.toString());
    setDisplayedAmount(formatDecimal(maxAmount, decimals, 5));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (Number.isNaN(Number(value))) {
      return;
    }
    
    if (value === '') {
      setAmount('');
      setDisplayedAmount('');
      return;
    }
    setAmount((Number(value) * Math.pow(10, decimals)).toString());
    setDisplayedAmount(value);
  };

  return (
    <>
      <Button classNames={cn("text-xs w-fit px-2 py-1 whitespace-nowrap", buttonDisabled && "opacity-50 cursor-not-allowed hover:opacity-50")} onClick={onOpen}>
        Request offset
      </Button>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Request offset</ModalHeader>
              <ModalBody>
                <Input
                  label="Amount"
                  placeholder="Enter amount of cc to offset"
                  variant="bordered"
                  value={displayedAmount}
                  onChange={handleAmountChange}
                />
                <div
                  className="text-xs hover:underline cursor-pointer ml-2"
                  onClick={handleMaxAmount}
                >
                  Set max ({formatDecimal(maxAmount, decimals, 5)})
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="flex gap-x-4 items-center justify-end">
                  <div
                    onClick={onClose}
                    className="text-sm hover:underline cursor-pointer"
                  >
                    Close
                  </div>
                  <Button onClick={handleRequest}>
                    Request offset
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
