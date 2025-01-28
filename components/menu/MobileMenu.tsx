import { Bars3Icon } from "@heroicons/react/16/solid";
import { Drawer, DrawerBody, DrawerContent, DrawerHeader, useDisclosure } from "@heroui/react";
import Menu from "./Menu";
import Address from "../common/Address";

export default function MobileMenu() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <>
      <Bars3Icon
        onClick={onOpen}
        className="w-8 h-8 cursor-pointer border border-neutral-800 rounded-full p-1 hover:text-neutral-900 dark:border-neutral-200 dark:hover:border-neutral-100" 
      />
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} placement="bottom" backdrop="blur">
        <DrawerContent>
          <>
            <DrawerHeader>
              <Address />
            </DrawerHeader>
            <DrawerBody className="pt-8 pb-8">
              <Menu />
            </DrawerBody>
          </>
        </DrawerContent>
      </Drawer>
    </>
  );
}
