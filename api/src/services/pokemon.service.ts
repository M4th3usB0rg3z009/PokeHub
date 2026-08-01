import axios from "axios";

const pokeApi = axios.create({
    baseURL: "https://pokeapi.co/api/v2",
    timeout: 10000
});

export async function getPokemonByNameOrId(nameOrId: string) {
    const normalizedValue = nameOrId.trim().toLowerCase();

    const response = await pokeApi.get(`/pokemon/${normalizedValue}`);

    const pokemon = response.data;

    return {
        id: pokemon.id,
        name: pokemon.name,
        height: pokemon.height,
        weight: pokemon.weight,

        image:
            pokemon.sprites.other["official-artwork"].front_default ??
            pokemon.sprites.front_default,

        types: pokemon.types.map(
            (item: { type: { name: string } }) => item.type.name
        ),

        abilities: pokemon.abilities.map(
            (item: { ability: { name: string } }) => item.ability.name
        ),

        stats: pokemon.stats.map(
            (item: {
                base_stat: number;
                stat: { name: string };
            }) => ({
                name: item.stat.name,
                value: item.base_stat
            })
        )
    };
}