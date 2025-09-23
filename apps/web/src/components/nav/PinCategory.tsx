import { ReactNode } from 'react';
import { motion } from 'framer-motion';

type Props = {
	label: string;
	items: any[];
	Icon: ReactNode;
	isExpanded: boolean;
	onClick: () => void;
};

function PinCategory({ label, items, Icon, isExpanded, onClick }: Props) {
	return (
		<div className="bg-gray-200 rounded-md">
			<div className="flex flex-row align-middle content-between justify-center">
				<button
					className="bg-gray-300 p-2 rounded-l-md flex flex-row"
					onClick={onClick}
				>
					{Icon}
					<p className="ml-2 font-semibold">{label}</p>
				</button>

				<motion.div
					initial={{ width: 0, opacity: 0 }}
					animate={
						isExpanded
							? { width: 'auto', opacity: 1 }
							: { width: 0, opacity: 0 }
					}
					transition={{ duration: 0.4 }}
					style={{ display: 'flex', flexDirection: 'row', overflowX: 'auto' }}
					className="p-2"
				>
					{items.map((item) => (
						<div key={item} style={{ marginRight: '1rem' }}>
							<p>{item}</p>
						</div>
					))}
				</motion.div>
			</div>
		</div>
	);
}

export default PinCategory;
