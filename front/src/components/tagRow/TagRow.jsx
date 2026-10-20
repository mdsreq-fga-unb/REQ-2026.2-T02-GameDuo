import './TagRow.css';

// tags: lista de textos, ex.: ["League of Legends", "Duo"]
function TagRow({ tags }) {
  return (
    <div className="tag-row">
      {tags.map((tag) => <span key={tag}>{tag}</span>)}
    </div>
  );
}

export default TagRow;
