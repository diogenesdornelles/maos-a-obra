import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { View } from 'react-native';
import { Textarea } from '../ui/textarea';

interface InputTextAreaPros {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  error?: string;
  isRequired?: boolean;
  maxLength?: number;
}

export function InputTextArea({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  isRequired = false,
  maxLength,
}: InputTextAreaPros) {
  return (
    <View className="mb-3">
      {label && (
        <Label className="mb-1">
          {label} {isRequired && <Text className="text-red-500">*</Text>}
        </Label>
      )}
      <Textarea
        maxLength={maxLength}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        className={error ? 'border-red-500' : ''}
      />
      {error && <Text className="mt-1 text-xs text-red-500">{error}</Text>}
    </View>
  );
}
