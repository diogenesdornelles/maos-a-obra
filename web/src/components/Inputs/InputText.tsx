import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { KeyboardType, View } from 'react-native';

interface InputTextProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  error?: string;
  isRequired?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardType;
  maxLength?: number;
}

export function InputText({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  isRequired = false,
  secureTextEntry = false,
  keyboardType,
  maxLength,
}: InputTextProps) {
  return (
    <View className="mb-3">
      {label && (
        <Label className="mb-1">
          {label} {isRequired && <Text className="text-red-500">*</Text>}
        </Label>
      )}
      <Input
        maxLength={maxLength}
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        className={error ? 'border-red-500' : ''}
      />
      {error && <Text className="mt-1 text-xs text-red-500">{error}</Text>}
    </View>
  );
}