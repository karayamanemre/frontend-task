"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Character, CharactersResponse } from "./types";
import Image from "next/image";
import { X, ChevronDown } from "lucide-react";

export const MultiSelectBox = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [characters, setCharacters] = useState<Character[]>([]);
	const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([]);
	const [isDropdownVisible, setIsDropdownVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
	const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
	const [prevScrollPosition, setPrevScrollPosition] = useState(0);
	const listRef = useRef<HTMLUListElement>(null);
	const wrapperRef = useRef(null);

	const handleSelectCharacter = (character: Character) => {
		const isSelected = selectedCharacters.some((c) => c.id === character.id);

		if (isSelected) {
			setSelectedCharacters(
				selectedCharacters.filter((c) => c.id !== character.id)
			);
		} else {
			setSelectedCharacters([...selectedCharacters, character]);
		}
	};

	const handleRemoveCharacter = (character: Character) => {
		setSelectedCharacters(
			selectedCharacters.filter((c) => c.id !== character.id)
		);
	};

	useEffect(() => {
		if (listRef.current) {
			listRef.current.scrollTop = prevScrollPosition;
		}
	}, [characters, prevScrollPosition]);

	const toggleDropdown = () => setIsDropdownVisible((v) => !v);

	const fetchCharacters = useCallback(
		async (searchTerm: string = "", nextPage: string = "") => {
			setLoading(true);
			const url =
				nextPage ||
				`https://rickandmortyapi.com/api/character/${
					searchTerm ? "?name=" + searchTerm : ""
				}`;

			try {
				const response = await fetch(url);
				const data: CharactersResponse = await response.json();
				if (data && Array.isArray(data.results)) {
					setCharacters((prev) =>
						nextPage ? [...prev, ...data.results] : data.results
					);
					setNextPageUrl(data.info.next);
				} else {
					setCharacters([]);
					setNextPageUrl(null);
				}
			} catch (error) {
				console.error("Failed to fetch characters:", error);
				setCharacters([]);
				setNextPageUrl(null);
			} finally {
				setLoading(false);
				setIsFetchingNextPage(false);
			}
		},
		[]
	);

	useEffect(() => {
		fetchCharacters(searchTerm);
	}, [searchTerm, fetchCharacters]);

	useEffect(() => {
		if (isFetchingNextPage && nextPageUrl) {
			fetchCharacters(searchTerm, nextPageUrl).then(() => {
				if (listRef.current) {
					listRef.current.scrollTop = prevScrollPosition;
				}
			});
		}
	}, [
		isFetchingNextPage,
		nextPageUrl,
		searchTerm,
		fetchCharacters,
		prevScrollPosition,
	]);

	const handleScroll = useCallback(
		(e: React.UIEvent<HTMLUListElement>) => {
			const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
			if (
				scrollHeight - scrollTop <= clientHeight + 100 &&
				nextPageUrl &&
				!loading
			) {
				setPrevScrollPosition(scrollTop);
				setIsFetchingNextPage(true);
			}
		},
		[loading, nextPageUrl, setIsFetchingNextPage]
	);

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
	}, []);

	const highlightText = (text: string, highlight: string) => {
		const parts = text.split(new RegExp(`(${highlight})`, "gi"));
		return parts.map((part, index) =>
			part.toLowerCase() === highlight.toLowerCase() ? (
				<strong key={index}>{part}</strong>
			) : (
				part
			)
		);
	};

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
					) : characters.length > 0 ? (
						characters.map((character, index) => (
							<li
								key={`${character.id}-${index}`}
								onClick={() => handleSelectCharacter(character)}
								className='p-2 hover:bg-gray-100 cursor-pointer flex items-center border-b border-[#95A4B8]'>
								<input
									type='checkbox'
									checked={selectedCharacters.some(
										(c) => c.id === character.id
									)}
									onChange={() => handleSelectCharacter(character)}
									className='mr-2 cursor-pointer'
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
									<div>{highlightText(character.name, searchTerm)}</div>
									<div className='text-xs text-gray-500'>
										{character.episode.length} episodes
									</div>
								</div>
							</li>
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
