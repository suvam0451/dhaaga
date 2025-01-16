export type AppTextNodeType =
	| 'para'
	| 'text'
	| 'mention'
	| 'tag'
	| 'customEmoji'
	| 'link'
	| 'inline'
	| 'italic'
	| 'bold'
	| 'code';

export type NodeContentBase = { uuid: string; nodes: NodeContent[] };
// these node types wrap underlying content
export const WrapperNode: AppTextNodeType[] = [
	'para',
	'italic',
	'bold',
	'inline',
];

export type NodeContentExtended =
	| {
			type: 'para';
	  }
	| {
			type: 'text';
			text: string;
	  }
	| {
			type: 'mention';
			text: string;
			url: string;
	  }
	| {
			type: 'tag';
			text: string;
	  }
	| {
			type: 'link';
			// this text is shortened
			text: string;
			url: string;
	  }
	| {
			type: 'inline';
	  }
	| {
			type: 'bold';
	  }
	| {
			type: 'italic';
	  }
	| {
			type: 'code';
			text: string;
	  }
	| {
			type: 'customEmoji';
			text: string;
			value: string;
			url?: string;
	  };

export type NodeContent = NodeContentBase & NodeContentExtended;

export type AppParsedTextNodes = NodeContent[];
