"use client";
import { useState, useEffect, useRef } from "react";
import { Character, CharactersResponse } from "./types";
import Image from "next/image";

export const MultiSelectBox = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [characters, setCharacters] = useState<Character[]>([]);
	const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([]);
	const [isDropdownVisible, setIsDropdownVisible] = useState(false);
	const wrapperRef = useRef(null);

	const fetchCharacters = async (searchTerm = "") => {
		const query = searchTerm ? `?name=${searchTerm}` : "";
		const response = await fetch(
			`https://rickandmortyapi.com/api/character/${query}`
		);
		const data: CharactersResponse = await response.json();
		setCharacters(data.results);
	};

	useEffect(() => {
		fetchCharacters();
	}, []);

	useEffect(() => {
		const handler = setTimeout(() => {
			fetchCharacters(searchTerm);
		}, 300);

		return () => clearTimeout(handler);
	}, [searchTerm]);

	const handleSelectCharacter = (character: Character) => {
		if (!selectedCharacters.includes(character)) {
			setSelectedCharacters([...selectedCharacters, character]);
		}
		setIsDropdownVisible(false);
	};

	const handleRemoveCharacter = (character: Character) => {
		setSelectedCharacters(selectedCharacters.filter((c) => c !== character));
	};

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

	return (
		<div
			ref={wrapperRef}
			className='relative max-w-3xl w-2/5'>
			<div className='flex flex-wrap gap-1 p-2'>
				{selectedCharacters.map((character) => (
					<div
						key={character.id}
						className='flex items-center bg-gray-200 rounded p-1'>
						<span className='mr-1'>{character.name}</span>
						<button
							onClick={() => handleRemoveCharacter(character)}
							className='bg-transparent hover:bg-gray-300 rounded'>
							&times;
						</button>
					</div>
				))}
				<input
					type='text'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					onFocus={() => setIsDropdownVisible(true)}
					className='flex-1 p-1'
					placeholder='Search characters...'
				/>
			</div>
			{isDropdownVisible && (
				<ul className='absolute w-full bg-white border border-gray-200 max-h-60 overflow-auto'>
					{characters.map((character) => (
						<li
							key={character.id}
							onClick={() => handleSelectCharacter(character)}
							className='p-2 hover:bg-gray-100 cursor-pointer flex items-center'>
							<Image
								src={character.image}
								alt={character.name}
								width={55}
								height={55}
								className='mr-2 rounded'
							/>
							<span>{character.name}</span>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};
