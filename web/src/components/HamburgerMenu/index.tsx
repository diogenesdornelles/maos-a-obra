import { router } from 'expo-router';
import { Menu } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

export function HamburgerMenu() {
  return (
    <TouchableOpacity
      onPress={() => {
        router.dismissAll();
        router.replace('/(platform)/home');
      }}>
      <Menu />
    </TouchableOpacity>
  );
}
