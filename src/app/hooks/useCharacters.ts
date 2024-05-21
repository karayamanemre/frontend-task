import { useState, useEffect, useCallback } from "react";
import { Character, CharactersResponse } from "../types";

export const useCharacters = (charactersPerPage: number) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [allCharacters, setAllCharacters] = useState<Character[]>([]);
	const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
	const [visibleCharacters, setVisibleCharacters] = useState<Character[]>([]);
	const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([]);
	const [isDropdownVisible, setIsDropdownVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	const fetchAllCharacters = useCallback(async () => {
		setLoading(true);
		let allFetchedCharacters: Character[] = [];
		let nextPageUrl:
			| string
			| null = `https://rickandmortyapi.com/api/character`;

		while (nextPageUrl) {
			try {
				const response = await fetch(nextPageUrl);
				const data: CharactersResponse = await response.json();
				if (data && Array.isArray(data.results)) {
					allFetchedCharacters = [...allFetchedCharacters, ...data.results];
					nextPageUrl = data.info.next;
				} else {
					nextPageUrl = null;
				}
			} catch (error) {
				console.error("Failed to fetch characters:", error);
				nextPageUrl = null;
			}
		}
		setAllCharacters(allFetchedCharacters);
		setVisibleCharacters(allFetchedCharacters.slice(0, charactersPerPage));
		setLoading(false);
	}, [charactersPerPage]);

	useEffect(() => {
		fetchAllCharacters();
	}, [fetchAllCharacters]);

	useEffect(() => {
		const filtered = allCharacters.filter((character) =>
			character.name.toLowerCase().includes(searchTerm.toLowerCase())
		);
		setFilteredCharacters(filtered);
		setVisibleCharacters(filtered.slice(0, charactersPerPage));
		setCurrentPage(1);
	}, [searchTerm, allCharacters, charactersPerPage]);

	const loadMoreCharacters = () => {
		setVisibleCharacters((prevCharacters) => [
			...prevCharacters,
			...filteredCharacters.slice(
				currentPage * charactersPerPage,
				(currentPage + 1) * charactersPerPage
			),
		]);
		setCurrentPage((prevPage) => prevPage + 1);
	};

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

	return {
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
	};
};
