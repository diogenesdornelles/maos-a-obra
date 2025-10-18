import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, View } from 'react-native';

interface InputDateProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  error?: string;
  isRequired?: boolean;
}

export function InputDate({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  isRequired = false,
}: InputDateProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
      const formattedDate = date.toLocaleDateString('pt-BR');
      onChangeText?.(formattedDate);
    }
  };

  return (
    <View className="mb-3">
      {label && (
        <Label className="mb-1">
          {label} {isRequired && <Text className="text-red-500">*</Text>}
        </Label>
      )}
      <Pressable onPress={() => setShowDatePicker(true)}>
        <Input
          value={value}
          placeholder={placeholder || 'Selecione uma data'}
          editable={false}
          pointerEvents="none"
          className={cn(error ? 'border-red-500' : '', 'opacity-100')}
        />
      </Pressable>
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
          locale="pt-BR"
        />
      )}
      {error && <Text className="mt-1 text-xs text-red-500">{error}</Text>}
    </View>
  );
}
