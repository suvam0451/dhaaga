import { useIAP } from 'expo-iap';
import { useEffect } from 'react';

const SUVAM_IO_SERVICE_IDS = ['suvam.io.subscription.jqf8'];
const SUVAM_IO_PRODUCT_IDS = [];

export function useIAPHook() {
	const { connected, products, subscriptions, fetchProducts, requestPurchase } =
		useIAP({
			onPurchaseSuccess: (purchase) => {
				console.log('Purchase successful:', purchase);
				handleSuccessfulPurchase(purchase);
			},
			onPurchaseError: (error) => {
				console.error('Purchase failed:', error);
				handlePurchaseError(error);
			},
		});

	function handleSubscriptionPurchase() {
		requestPurchase({
			request: { google: { skus: [SUVAM_IO_SERVICE_IDS[0]] } },
			type: 'subs',
		});
	}

	function handleSuccessfulPurchase(purchase: any) {}

	function handlePurchaseError(error: any) {}

	useEffect(() => {
		if (connected) {
			// Fetch products and subscriptions
			fetchProducts({
				skus: SUVAM_IO_PRODUCT_IDS,
				type: 'in-app',
			});
			fetchProducts({
				skus: SUVAM_IO_SERVICE_IDS,
				type: 'subs',
			});
		}
	}, [connected]);

	return { handleSubscriptionPurchase, subscriptions, products };
}
