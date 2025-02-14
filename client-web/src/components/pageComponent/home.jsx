const Home = () => {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-2xl">
          <h1 className="text-4xl font-bold text-gray-800">Welcome to Library</h1>
          <p className="text-gray-600 mt-2">
            Discover new books and explore a world of knowledge.
          </p>
  
          {/* ส่วนแสดงหนังสือแนะนำ */}
          <div className="mt-6">
            <h2 className="text-2xl font-semibold text-gray-700">Recommended Books</h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-200 p-4 rounded-lg shadow-sm">📖 Book 1</div>
              <div className="bg-gray-200 p-4 rounded-lg shadow-sm">📖 Book 2</div>
              <div className="bg-gray-200 p-4 rounded-lg shadow-sm">📖 Book 3</div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Home;
  