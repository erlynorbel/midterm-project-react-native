import { useAppContext } from '@/context/app-context';

export function useColorScheme() {
	const { themeMode } = useAppContext();
	return themeMode;
}
