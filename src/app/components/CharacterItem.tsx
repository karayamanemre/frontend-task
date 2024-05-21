import Image from "next/image";
import { X } from "lucide-react";
import { Character } from "../types";
import { highlightText } from "../utils/highlightText";

interface CharacterItemProps {
	character: Character;
	isSelected: boolean;
	onSelect: (character: Character) => void;
	onRemove: (character: Character) => void;
	highlight: string;
	showRemoveButton: boolean;
}

export const CharacterItem: React.FC<CharacterItemProps> = ({
	character,
	isSelected,
	onSelect,
	onRemove,
	highlight,
	showRemoveButton,
}) => {
	return (
		<li
			onClick={() => onSelect(character)}
			className='p-2 hover:bg-gray-100 cursor-pointer flex items-center border-b border-[#95A4B8]'>
			<input
				type='checkbox'
				checked={isSelected}
				onChange={() => onSelect(character)}
				className='mr-2 cursor-pointer accent-black'
			/>
			<Image
				src={character.image}
				alt={character.name}
				width={32}
				height={32}
				quality={50}
				className='rounded-lg'
			/>
			<div className='ml-2'>
				<div>{highlightText(character.name, highlight)}</div>
				<div className='text-xs text-gray-500'>
					{character.episode.length} episodes
				</div>
			</div>
			{showRemoveButton && isSelected && (
				<button
					onClick={(e) => {
						e.stopPropagation();
						onRemove(character);
					}}
					className=' bg-[#94A3B8] hover:bg-gray-400 rounded text-white w-6 h-6 flex items-center justify-center ml-2'>
					<X size={20} />
				</button>
			)}
		</li>
	);
};
