import * as React from 'react';
import { Text } from '@rneui/themed';

class AstService {
	static applyTextStylingToChildren(node: JSX.Element | JSX.Element[]) {
		if (Array.isArray(node)) {
			return node.map((o, i) =>
				React.Children.map(o, (child: any) => {
					if (React.isValidElement(child) && child.type === Text) {
						// Example: Update text content
						return React.cloneElement(child, {
							// @ts-ignore
							style: [
								// @ts-ignore
								child.props.style,
								{
									fontFamily: 'Montserrat-ExtraBold',
									// fontSize: 48,
								},
							],
							// children: child.props.children.toUpperCase()
						});
					}
					return child;
				}),
			);
		}
		return React.Children.map(node, (child: any) => {
			if (React.isValidElement(child) && child.type === Text) {
				// Example: Update text content
				return React.cloneElement(child, {
					// @ts-ignore
					style: [
						// @ts-ignore
						child.props.style,
						{
							fontFamily: 'Montserrat-ExtraBold',
							// fontSize: 48,
						},
					],
					// children: child.props.children.toUpperCase()
				});
			}
			return child;
		});
	}
}

export default AstService;
