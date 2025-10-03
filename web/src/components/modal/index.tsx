import { View } from 'react-native';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { Text } from '../ui/text';

export interface ModalProps {
  isOpen?: boolean;
  Trigger?: React.ReactNode;
  title?: string;
  Header?: React.ReactNode;
  description?: React.ReactNode;
  footerButtons?: React.ReactNode;
}

export function Modal({ isOpen, Trigger, title, description, footerButtons, Header }: ModalProps) {
  return (
    <AlertDialog open={isOpen}>
      {Trigger ? <AlertDialogTrigger>{Trigger}</AlertDialogTrigger> : <></>}
      <AlertDialogContent>
        <AlertDialogHeader>
          {title || Header ? <AlertDialogTitle>{Header ?? title}</AlertDialogTitle> : <></>}
          {description ? <AlertDialogDescription>{description}</AlertDialogDescription> : <></>}
        </AlertDialogHeader>
        {footerButtons ? (
          <AlertDialogFooter>{footerButtons}</AlertDialogFooter>
        ) : (
          <AlertDialogFooter>
            {
              <View className="flex flex-row gap-2">
                <Button>
                  <Text>Sim</Text>
                </Button>
                <Button variant={'secondary'}>
                  <Text>Não</Text>
                </Button>
              </View>
            }
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
