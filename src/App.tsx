import React from 'react';
import './App.scss';
import Carousel from './components/Carousel';

type Settings = {
  visibleFrameOfBlockImages: number;
  imageWidth: number;
  stepToShiftBlockOfImages: number;
  isScrollAnimationOn: boolean,
  animationDuration: number;
  isInfiniteScrollOn: boolean;
  shiftBlockOfImages: number,
  shiftInnerBlockOfImages: number,
  isPreviousScrollLeftAnimationOver: boolean,
};

type State = {
  images: string[];
  settings: Settings;
};

class App extends React.Component<{}, State> {
  state: State = {
    images: [
      './img/1.png',
      './img/2.png',
      './img/3.png',
      './img/4.png',
      './img/5.png',
      './img/6.png',
      './img/7.png',
      './img/8.png',
      './img/9.png',
      './img/10.png',
    ],
    settings: {
      imageWidth: 130,
      visibleFrameOfBlockImages: 3,
      stepToShiftBlockOfImages: 3,
      animationDuration: 1000,
      isScrollAnimationOn: true,
      isInfiniteScrollOn: false,
      shiftBlockOfImages: 0,
      shiftInnerBlockOfImages: 0,
      isPreviousScrollLeftAnimationOver: false,
    },
  };

  componentDidUpdate() {
    const {
      imageWidth,
      stepToShiftBlockOfImages,
      animationDuration,
      isScrollAnimationOn,
      isInfiniteScrollOn,
      isPreviousScrollLeftAnimationOver,
    } = this.state.settings;

    const { images } = this.state;

    if (!isScrollAnimationOn && !isInfiniteScrollOn) {
      const newSettings = this.state.settings;

      this.setState({
        settings: {
          ...newSettings,
          isScrollAnimationOn: true,
          shiftBlockOfImages: 0,
          shiftInnerBlockOfImages: 0,
        },
      });
    }

    if (isPreviousScrollLeftAnimationOver
      && isInfiniteScrollOn) {
      const prevImage = images.splice(0, stepToShiftBlockOfImages);
      const newImages = [...images, ...prevImage];
      const shift = imageWidth * stepToShiftBlockOfImages;

      setTimeout(() => {
        this.setState(({ settings }) => {
          const {
            shiftBlockOfImages,
            shiftInnerBlockOfImages,
          } = settings;

          return ({
            images: newImages,
            settings: {
              ...settings,
              isScrollAnimationOn: false,
              shiftBlockOfImages: shiftBlockOfImages + shift,
              shiftInnerBlockOfImages,
              isPreviousScrollLeftAnimationOver: false,
            },
          });
        });
      }, animationDuration);
    }
  }

  scrollLeft = () => {
    const {
      isInfiniteScrollOn,
      isPreviousScrollLeftAnimationOver,
    } = this.state.settings;

    if (isInfiniteScrollOn && !isPreviousScrollLeftAnimationOver) {
      this.setState(({ settings }) => {
        const {
          imageWidth,
          stepToShiftBlockOfImages,
          shiftBlockOfImages,
          shiftInnerBlockOfImages,
        } = settings;

        const shift = imageWidth * stepToShiftBlockOfImages;

        return ({
          settings: {
            ...settings,
            isScrollAnimationOn: true,
            shiftBlockOfImages: shiftBlockOfImages - shift,
            shiftInnerBlockOfImages,
            isPreviousScrollLeftAnimationOver: true,
          },
        });
      });
    }

    if (!isInfiniteScrollOn) {
      this.setState(({ images, settings }) => {
        const {
          imageWidth,
          visibleFrameOfBlockImages,
          stepToShiftBlockOfImages,
          shiftBlockOfImages,
        } = settings;

        const shift = imageWidth * stepToShiftBlockOfImages;
        let addShift = shiftBlockOfImages - shift;

        if (shiftBlockOfImages - shift
            < -(images.length - 1) * imageWidth) {
          addShift = -(images.length - visibleFrameOfBlockImages)
            * imageWidth;
        }

        return ({
          images,
          settings: {
            ...settings,
            shiftBlockOfImages: addShift,
          },
        });
      });
    }
  };

  scrollRight = () => {
    const {
      isInfiniteScrollOn,
    } = this.state.settings;

    if (isInfiniteScrollOn) {
      this.setState(({ images, settings }) => {
        const {
          imageWidth,
          stepToShiftBlockOfImages,
          shiftBlockOfImages,
          shiftInnerBlockOfImages,
        } = settings;

        const prevImage = images.splice(-stepToShiftBlockOfImages);
        const newImages = [...prevImage, ...images];
        const shift = imageWidth * stepToShiftBlockOfImages;

        return ({
          images: newImages,
          settings: {
            ...settings,
            shiftBlockOfImages: shiftBlockOfImages - shift,
            shiftInnerBlockOfImages: shiftInnerBlockOfImages + shift,
            isScrollAnimationOn: false,
          },
        });
      });
    }

    if (!isInfiniteScrollOn) {
      this.setState(({ images, settings }) => {
        const {
          imageWidth,
          stepToShiftBlockOfImages,
          shiftBlockOfImages,
        } = settings;

        const shift = imageWidth * stepToShiftBlockOfImages;

        let addShift = shiftBlockOfImages + shift;

        if (shiftBlockOfImages + shift > 0) {
          addShift = 0;
        }

        return ({
          images,
          settings: {
            ...settings,
            shiftBlockOfImages: addShift,
          },
        });
      });
    }
  };

  updateSettings
  <T extends keyof Settings>(parameter: T, newValue: Settings[T]) {
    this.setState(({ settings }) => ({
      settings: {
        ...settings,
        [parameter]: newValue,
      },
    }));
  }

  render() {
    const { images } = this.state;
    const {
      imageWidth,
      visibleFrameOfBlockImages,
      stepToShiftBlockOfImages,
      animationDuration,
      isScrollAnimationOn,
      isInfiniteScrollOn,
      shiftBlockOfImages,
      shiftInnerBlockOfImages,
    } = this.state.settings;

    return (
      <div className="app">
        <h1>
          {`Carousel with ${images.length} images`}
        </h1>

        <Carousel
          images={images}
          imageWidth={imageWidth}
          visibleFrameOfBlockImages={visibleFrameOfBlockImages}
          animationDuration={animationDuration}
          isScrollAnimationOn={isScrollAnimationOn}
          shiftBlockOfImages={shiftBlockOfImages}
          shiftInnerBlockOfImages={shiftInnerBlockOfImages}
        />
        <div className="carousel__buttons">
          <button
            type="button"
            className="carousel__prev-button"
            onClick={this.scrollRight}
            disabled={
              !isInfiniteScrollOn
              && shiftBlockOfImages >= 0
            }
          >
            {'<'}
          </button>
          <button
            type="button"
            className="carousel__next-button"
            onClick={this.scrollLeft}
            disabled={
              !isInfiniteScrollOn
              && shiftBlockOfImages
                < -(images.length - visibleFrameOfBlockImages - 1) * imageWidth
            }
          >
            {'>'}
          </button>
        </div>
        <fieldset className="app__settings">
          <label className="app__setting">
            Step:
            <input
              className="app__step"
              type="number"
              min="1"
              max={images.length}
              defaultValue={stepToShiftBlockOfImages}
              onChange={
                (({ target }) => this
                  .updateSettings('stepToShiftBlockOfImages',
                    Number(target.value)))
              }
            />
          </label>

          <label className="app__setting">
            Frame size:
            <input
              className="app__frame-size"
              type="number"
              min="1"
              max={images.length}
              defaultValue={visibleFrameOfBlockImages}
              onChange={
                (({ target }) => this
                  .updateSettings('visibleFrameOfBlockImages',
                    Number(target.value)))
              }
            />
          </label>

          <label className="app__setting">
            Item width:
            <input
              className="app__item-width"
              type="number"
              min="80"
              max="180"
              step="10"
              defaultValue={imageWidth}
              onChange={
                (({ target }) => this
                  .updateSettings('imageWidth', Number(target.value)))
              }
            />
          </label>

          <label className="app__setting">
            Anitmation duration:
            <input
              className="app__animation-duration"
              type="number"
              min="0"
              max="2000"
              step="500"
              defaultValue={animationDuration}
              onChange={
                (({ target }) => this
                  .updateSettings('animationDuration', Number(target.value)))
              }
            />
          </label>

          <label className="app__setting">
            Infinite:
            <input
              className="app__infinite"
              type="checkbox"
              defaultChecked={isInfiniteScrollOn}
              onChange={
                (({ target }) => this
                  .updateSettings('isInfiniteScrollOn', target.checked))
              }
            />
            {
              isInfiniteScrollOn
                ? 'Yes'
                : 'No'
            }
          </label>
        </fieldset>
      </div>
    );
  }
}

export default App;
