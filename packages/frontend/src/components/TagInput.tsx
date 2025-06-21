import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export default function TagInput({ tags, onChange, placeholder = 'Add tags...' }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      // Remove last tag on backspace if input is empty
      removeTag(tags.length - 1);
    }
  };

  const addTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !tags.includes(trimmedValue)) {
      onChange([...tags, trimmedValue]);
      setInputValue('');
    }
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    onChange(newTags);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-semibold">Tags</span>
        <label className="label">
          <span className="label-text-alt text-base-content/60">
            (Press Enter or comma to add a tag)
          </span>
        </label>
      </label>
      <div className="input input-bordered flex flex-wrap gap-2 min-h-12 items-center mt-2">
        {tags.map((tag, index) => (
          <span key={index} className="badge badge-primary badge-outline gap-1 px-3 py-2">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="btn btn-ghost btn-xs p-0 h-auto min-h-0"
            >
              <XMarkIcon className="size-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-0 border-none outline-none bg-transparent"
        />
      </div>
    </div>
  );
}
