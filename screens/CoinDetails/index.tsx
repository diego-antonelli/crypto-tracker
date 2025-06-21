import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useCryptoCoins } from '@/hooks';
import { Crypto } from '@/types';
import Toast from 'react-native-toast-message';
import { CoinDetailsView } from '@/screens/CoinDetails/View';

export function CoinDetails() {
  const { id } = useLocalSearchParams();
  const { data } = useCryptoCoins();
  const router = useRouter();

  const [coin, setCoin] = useState<Crypto | undefined>(undefined);

  useEffect(() => {
    const match = data?.find((c: Crypto) => c.id === id);
    if (match) setCoin(match);

    if (!match) {
      Toast.show({ type: 'error', text1: 'Crypto coin not found' });
      router.back();
    }
  }, [id, data]);

  return <CoinDetailsView coin={coin} />;
}
