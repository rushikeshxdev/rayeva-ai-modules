function JsonDisplay({ data, title }) {
  return (
    <div className="mt-6 p-4 bg-gray-100 rounded-lg">
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <pre className="overflow-auto text-sm bg-white p-4 rounded border">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

export default JsonDisplay;
