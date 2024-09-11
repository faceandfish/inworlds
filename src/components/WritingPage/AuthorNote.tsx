import React from "react";

interface AuthorNoteProps {
  authorNote: string;
  onAuthorNoteChange: (note: string) => void;
  error?: string;
}

const AuthorNote: React.FC<AuthorNoteProps> = ({
  authorNote,
  onAuthorNoteChange,
  error
}) => {
  const maxLength = 1000;

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onAuthorNoteChange(e.target.value);
  };

  return (
    <div className="w-full ">
      <label
        htmlFor="authorNote"
        className="block text-2xl font-medium text-gray-700 mb-6"
      >
        作者留言
      </label>
      <div className="relative">
        <textarea
          id="authorNote"
          name="authorNote"
          rows={8}
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-orange-500"
          placeholder="请在这里写下您想对读者说的话..."
          value={authorNote}
          onChange={handleNoteChange}
          maxLength={maxLength}
        ></textarea>
        <p className="absolute bottom-2 right-3  text-sm text-gray-500 mt-2">
          {authorNote.length}/{maxLength} 字符
        </p>
      </div>
    </div>
  );
};

export default AuthorNote;
