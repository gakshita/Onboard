const Navbar = () => {
  return (
    <div className="mb-10">
      <div className="flex justify-end gap-x-5 px-10 pb-2 pt-2 text-xs		">
        <button>Help</button>
        <button>Orders & Returns</button>
        {/* <button>Logout</button> */}
      </div>
      <div className="flex justify-between px-10 pb-2">
        <div className="text-xxxl font-bold">ECOMMERCE</div>
        <div className="m-auto flex gap-x-10">
          <span className="text-md font-semibold">Categories</span>
          <span className="text-md font-semibold">Sale</span>
          <span className="text-md font-semibold">Clearance</span>
          <span className="text-md font-semibold">Price Drop</span>
          <span className="text-md font-semibold">Trending</span>
        </div>
        <div className="flex gap-x-10">
          <img src="/images/Search.svg" alt="search" />
          <img src="/images/Cart.svg" alt="search" />
        </div>
      </div>
      <div className="bg-grey pb-2 pt-2 text-center text-sm font-medium">
        {"<"} &nbsp;&nbsp; Get 10% off on business sign up &nbsp;&nbsp; {">"}
      </div>
    </div>
  );
};

export default Navbar;
