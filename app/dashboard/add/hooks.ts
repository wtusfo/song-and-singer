import { Genre, Language } from "@/types/models";
import { useMemo } from "react";

export function useGenreOptions(data: Genre[] | undefined) {
    return useMemo(() => {
        return data?.map(genre => ({
            label: genre.name,
            value: genre.id,
        })) || []
    }, [data])
}

export function useLanguageOptions(data: Language[] | undefined) {
    return useMemo(() => {
        return data?.map(language => ({
            label: language.name,
            value: language.id,
        })) || []
    }, [data])
}

export function useHandlers() {
    const handleSubmit = async (values) => {
        try {
            fetch('/api/lyrics', {
                method: 'POST',
                body: JSON.stringify(values),
            })
        } catch (error) {
            console.log({ error })
        }
    }

    return {
        handleSubmit
    }
}