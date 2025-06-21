import { useSelector, useDispatch } from 'react-redux';
import {useCallback, useEffect, useState} from 'react';
import {getCryptos, resetCoins, setPage} from "@/stores/slices/cryptoSlice";
import {AppDispatch, RootState} from "@/types";

export const useCryptoCoins = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { data, loading, error, page } = useSelector((state: RootState) => state.cryptos);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        if (data.length === 0) {
            dispatch(getCryptos(1));
        }
        //@eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchNext = useCallback(() => {
        const nextPage = page + 1;
        dispatch(setPage(nextPage));
        dispatch(getCryptos(nextPage));
    }, [dispatch, page]);

    const refresh = useCallback(() => {
        setIsRefreshing(true);
        dispatch(resetCoins());
        dispatch(getCryptos(1));
        setIsRefreshing(false);
    }, [dispatch]);

    return {
        data,
        isLoading: loading,
        isRefreshing,
        error,
        page,
        fetchNext,
        refresh,
    };
};
