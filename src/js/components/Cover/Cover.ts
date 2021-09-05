import { Components, CoverComponent, Options, SlideComponent } from '@splidejs/splide';
import { EVENT_LAZYLOAD_LOADED, EVENT_MOUNTED, EVENT_REFRESH, EVENT_UPDATED } from '../../constants/events';
import { EventInterface } from '../../constructors';
import { Splide } from '../../core/Splide/Splide';
import { child, display } from '../../utils';


/**
 * The component for setting the image as the slide background.
 *
 * @since 3.0.0
 *
 * @param Splide     - A Splide instance.
 * @param Components - A collection of components.
 * @param options    - Options.
 *
 * @return A Cover component object.
 */
export function Cover( Splide: Splide, Components: Components, options: Options ): CoverComponent {
  const { on } = EventInterface( Splide );

  /**
   * Called when the component is mounted.
   */
  function mount(): void {
    if ( options.cover ) {
      on( EVENT_LAZYLOAD_LOADED, ( img, Slide ) => { toggle( true, img, Slide ) } );
      on( [ EVENT_MOUNTED, EVENT_UPDATED, EVENT_REFRESH ], apply.bind( null, true ) );
    }
  }

  /**
   * Destroys the component.
   */
  function destroy(): void {
    apply( false );
  }

  /**
   * Sets/removes the background image to/from all slides.
   *
   * @param cover - If `false`, removes the background image.
   */
  function apply( cover: boolean ): void {
    Components.Slides.forEach( Slide => {
      const img = child<HTMLImageElement>( Slide.container || Slide.slide, 'img' );

      if ( img && img.src ) {
        toggle( cover, img, Slide );
      }
    } );
  }

  /**
   * Sets/removes the background image to/from the parent element.
   *
   * @param cover - If `false`, removes the background image.
   * @param img   - A target image element.
   * @param Slide - A SlideComponent object where the image belongs.
   */
  function toggle( cover: boolean, img: HTMLImageElement, Slide: SlideComponent ): void {
    Slide.rule( 'background', cover ? `center/cover no-repeat url("${ img.src }")` : '', true );
    display( img, cover ? 'none' : '' );
  }

  return {
    mount,
    destroy,
  };
}
