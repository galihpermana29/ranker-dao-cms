import Triangle from 'assets/img/shop/more-games.png';

const ShopSelector = ({ setActiveGame, list = {} }) => {
  const onClickChangeGame = game => {
    setActiveGame(game);
  };

  const result = [];
  Object.keys(list).forEach(function (key) {
    return result.push(list[key]);
  });

  return (
    <div className="shop-selector row w-100 mt-5">
      {result.length &&
        result.map(({ name = '' }, index) => {
          return (
            <div
              onClick={() => onClickChangeGame(name)}
              key={index}
              className="shop-selector-item col-12 px-0">
              <p className="m-0 py-2 px-0">{name.toUpperCase()}</p>
            </div>
          );
        })}
      <div className="shop-selector-item d-flex justify-content-between flex-row flex-nowrap align-items-center col-12 px-0">
        <p className="m-0 py-2 px-0">MORE GAMES</p>
        <img src={Triangle} alt="more games" className="triangle-more-games" />
      </div>
    </div>
  );
};

export { ShopSelector };
