import { DimensionValue, View } from 'react-native';
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
  height?: DimensionValue;
  width?: DimensionValue;
}

export function Modal({
  isOpen,
  Trigger,
  title,
  description,
  footerButtons,
  Header,
  height,
  width,
}: ModalProps) {
  if (!isOpen) {
    return Trigger ? (
      <AlertDialog>{<AlertDialogTrigger>{Trigger}</AlertDialogTrigger>}</AlertDialog>
    ) : null;
  }

  return (
    <AlertDialog open>
      {Trigger ? <AlertDialogTrigger>{Trigger}</AlertDialogTrigger> : null}
      <AlertDialogContent style={{ width: width, height: height }}>
        <AlertDialogHeader>
          {title || Header ? <AlertDialogTitle>{Header ?? title}</AlertDialogTitle> : null}
          {description ? <AlertDialogDescription>{description}</AlertDialogDescription> : null}
        </AlertDialogHeader>
        {footerButtons ? (
          <AlertDialogFooter>{footerButtons}</AlertDialogFooter>
        ) : (
          <AlertDialogFooter>
            <View className="flex flex-row gap-2">
              <Button>
                <Text>Sim</Text>
              </Button>
              <Button variant="secondary">
                <Text>Não</Text>
              </Button>
            </View>
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
