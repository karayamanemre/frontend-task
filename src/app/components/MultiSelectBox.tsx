"use client";
import { useRef, useEffect } from "react";
import { CharacterItem } from "./CharacterItem";
import { ChevronDown, X } from "lucide-react";
import { useCharacters } from "../hooks/useCharacters";

export const MultiSelectBox = () => {
	const {
		searchTerm,
		setSearchTerm,
		visibleCharacters,
		selectedCharacters,
		setSelectedCharacters,
		isDropdownVisible,
		setIsDropdownVisible,
		loading,
		handleSelectCharacter,
		handleRemoveCharacter,
		loadMoreCharacters,
	} = useCharacters(20);

	const listRef = useRef<HTMLUListElement>(null);
	const wrapperRef = useRef(null);

	const handleScroll = (e: React.UIEvent<HTMLUListElement>) => {
		const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
		if (scrollHeight - scrollTop <= clientHeight + 100 && !loading) {
			loadMoreCharacters();
		}
	};

	const toggleDropdown = () => setIsDropdownVisible((v) => !v);

	const handleClickOutside = (event: MouseEvent) => {
		if (
			wrapperRef.current &&
			!(wrapperRef.current as any).contains(event.target)
		) {
			setIsDropdownVisible(false);
		}
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div
			ref={wrapperRef}
			className='w-[320px] md:w-[500px]'>
			<div className='relative flex flex-wrap gap-1 p-1 pr-4 border border-[#95A4B8] mb-2 rounded-xl'>
				{selectedCharacters.map((character) => (
					<div
						key={character.id}
						className='flex items-center bg-[#E2E8F0] rounded-lg p-1 px-2'>
						<span className='mr-2'>{character.name}</span>
						<button
							onClick={() => handleRemoveCharacter(character)}
							className=' bg-[#94A3B8] hover:bg-gray-400 rounded text-white w-6 h-6 flex items-center justify-center'>
							<X size={20} />
						</button>
					</div>
				))}
				<input
					type='text'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					onFocus={() => setIsDropdownVisible(true)}
					className='flex-1 p-1 outline-none bg-transparent'
					placeholder='Search characters...'
				/>
				<button
					onClick={toggleDropdown}
					className='absolute right-2 top-1/2 transform -translate-y-1/2'>
					<ChevronDown
						className={
							isDropdownVisible
								? "rotate-180 transition-all ease-in-out"
								: "transition-all ease-in-out"
						}
					/>
				</button>
			</div>
			{isDropdownVisible && (
				<ul
					ref={listRef}
					onScroll={handleScroll}
					className='absolute w-[320px] md:w-[500px] bg-white border rounded-xl border-[#95A4B8] max-h-[400px] overflow-auto z-10 scrollbar scrollbar-thumb-[#9BA3AF] scrollbar-track-transparent'>
					{loading ? (
						<div className='flex justify-center items-center p-2'>
							<div className='loader 	rounded-full border-4 border-t-4 border-gray-200 h-8 w-8'></div>
						</div>
					) : visibleCharacters.length > 0 ? (
						visibleCharacters.map((character) => (
							<CharacterItem
								key={character.id}
								character={character}
								isSelected={selectedCharacters.some(
									(c) => c.id === character.id
								)}
								onSelect={handleSelectCharacter}
								onRemove={handleRemoveCharacter}
								highlight={searchTerm}
								showRemoveButton={false}
							/>
						))
					) : (
						<div className='text-center p-2 text-gray-500'>
							No characters found. Search something else.
						</div>
					)}
				</ul>
			)}
		</div>
	);
};
