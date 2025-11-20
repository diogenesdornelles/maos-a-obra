import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import { Platform, Pressable, View } from 'react-native';

interface InputDateProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  error?: string;
  isRequired?: boolean;
  editable?: boolean;
}

export function InputDate({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  isRequired = false,
  editable = true,
}: InputDateProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (value) {
      const dateOnly = value.split('T')[0];
      const [year, month, day] = dateOnly.split('-').map(Number);
      
      const date = new Date(year, month - 1, day);
      
      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
      }
    }
  }, [value]);

  const formatDateToBR = (dateString?: string): string => {
    if (!dateString) return '';
    
    const dateOnly = dateString.split('T')[0];
    const [year, month, day] = dateOnly.split('-');
    
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
      
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      
      const utcDate = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
      const isoString = utcDate.toISOString();
      
      onChangeText?.(isoString);
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
          value={formatDateToBR(value)}
          placeholder={placeholder || 'Selecione uma data'}
          editable={editable}
          pointerEvents="none"
          className={cn(error ? 'border-red-500' : '', 'opacity-100')}
        />
      </Pressable>
      {showDatePicker && editable && (
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