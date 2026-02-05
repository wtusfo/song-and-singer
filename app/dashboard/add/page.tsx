"use client";

import { useForm } from "@tanstack/react-form";
import {
  Input,
  Select,
  TextArea,
  Button,
  SelectOption,
} from "@/app/components/elements";
import { useGenres, useLanguages } from "@/hooks/swr";
import { useGenreOptions, useHandlers, useLanguageOptions } from "./hooks";

export default function AddSongPage() {
  const { data: genres, } = useGenres()
  const { data: languages } = useLanguages()
  const genreOptions = useGenreOptions(genres)
  const languageOptions = useLanguageOptions(languages)
  const { handleSubmit } = useHandlers()

  const form = useForm({
    defaultValues: {
      language: "",
      name: "",
      genre: "",
      artistName: "",
      lyrics: "",
      languageTranslation: "",
      nameTranslation: "",
      lyricsTranslation: "",
    },
    onSubmit: async ({ value }) => handleSubmit(value),
  });

  return (
    <div className="py-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Original */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-navy dark:text-cream mb-4">
              Original
            </h2>

            <form.Field name="language">
              {(field) => (
                <Select
                  label="Language"
                  options={languageOptions}
                  value={field.state.value}
                  onChange={(value) => field.handleChange(value)}
                  placeholder="Select language"
                  searchable
                  size="large"
                />
              )}
            </form.Field>

            <form.Field name="name">
              {(field) => (
                <Input
                  label="Song Name"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Enter song name"
                  size="large"
                />
              )}
            </form.Field>

            <form.Field name="genre">
              {(field) => (
                <Select
                  label="Genre"
                  options={genreOptions}
                  value={field.state.value}
                  onChange={(value) => field.handleChange(value)}
                  placeholder="Select genre"
                  searchable
                  size="large"
                />
              )}
            </form.Field>

            <form.Field name="artistName">
              {(field) => (
                <Input
                  label="Artist Name"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Enter artist name"
                  size="large"
                />
              )}
            </form.Field>
          </div>

          {/* Right Side - Translation */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-navy dark:text-cream mb-4">
              Translation
            </h2>

            <form.Field name="languageTranslation">
              {(field) => (
                <Select
                  label="Language"
                  options={languageOptions}
                  value={field.state.value}
                  onChange={(value) => field.handleChange(value)}
                  placeholder="Select target language"
                  searchable
                  size="large"
                />
              )}
            </form.Field>

            <form.Field name="nameTranslation">
              {(field) => (
                <Input
                  label="Name (Optional)"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Enter translated song name"
                  size="large"
                />
              )}
            </form.Field>
          </div>
        </div>

        {/* Lyrics Section - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <form.Field name="lyrics">
            {(field) => (
              <TextArea
                label="Lyrics"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="Enter song lyrics..."
                size="large"
                rows={20}
                className="min-h-100"
              />
            )}
          </form.Field>

          <form.Field name="lyricsTranslation">
            {(field) => (
              <TextArea
                label="Lyrics"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="Enter translated lyrics..."
                size="large"
                rows={20}
                className="min-h-100"
              />
            )}
          </form.Field>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="flex flex-col md:flex-row gap-3 w-full max-w-120">
            <Button type="submit" size="large" className="w-full">
              Add Song
            </Button>
            <Button type="button" variant="secondary" size="large" className="w-full">
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
