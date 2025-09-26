import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Text } from '../ui/text';

export interface InputLabelProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  error?: string;
  isRequired?: boolean;
  secureTextEntry?: boolean;
  type?: 'normal' | 'date';
}

export function InputLabel({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  isRequired = false,
  secureTextEntry = false,
  type = 'normal',
}: InputLabelProps) {
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

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  return (
    <View className="mb-1">
      <Label className="mb-1">
        {label} {isRequired && <Text className="text-red-500">*</Text>}
      </Label>
      {type === 'date' ? (
        <>
          <Pressable onPress={showDatepicker}>
            <Input
              value={value || 'Selecione uma data'}
              placeholder={placeholder}
              editable={false}
              pointerEvents="none"
              className={error ? 'border-red-500' : ''}
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
        </>
      ) : (
        <Input
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          className={error ? 'border-red-500' : ''}
        />
      )}
      {error && <Text className="mt-1 text-xs text-red-500">{error}</Text>}
    </View>
  );
}
