"use client";

import { useForm } from "@tanstack/react-form";
import {
  Input,
  Select,
  TextArea,
  Button,
  SelectOption,
} from "@/app/components/elements";

const languageOptions: SelectOption[] = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "ru", label: "Russian" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "zh", label: "Chinese" },
  { value: "ar", label: "Arabic" },
  { value: "hi", label: "Hindi" },
  { value: "tr", label: "Turkish" },
  { value: "pl", label: "Polish" },
  { value: "uk", label: "Ukrainian" },
];

const genreOptions: SelectOption[] = [
  { value: "pop", label: "Pop" },
  { value: "rock", label: "Rock" },
  { value: "hip-hop", label: "Hip Hop" },
  { value: "rnb", label: "R&B" },
  { value: "jazz", label: "Jazz" },
  { value: "blues", label: "Blues" },
  { value: "country", label: "Country" },
  { value: "electronic", label: "Electronic" },
  { value: "classical", label: "Classical" },
  { value: "reggae", label: "Reggae" },
  { value: "folk", label: "Folk" },
  { value: "metal", label: "Metal" },
  { value: "punk", label: "Punk" },
  { value: "soul", label: "Soul" },
  { value: "indie", label: "Indie" },
  { value: "alternative", label: "Alternative" },
];

export default function AddSongPage() {
  const form = useForm({
    defaultValues: {
      language: "",
      name: "",
      genre: "",
      artistName: "",
      lyrics: "",
      translationLanguage: "",
      translatedName: "",
      translatedLyrics: "",
    },
    onSubmit: async ({ value }) => {
      console.log("Form submitted:", value);
    },
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

            <form.Field name="translationLanguage">
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

            <form.Field name="translatedName">
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

          <form.Field name="translatedLyrics">
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
