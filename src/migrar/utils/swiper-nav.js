export const createSwiperNavigation = (outerWrapper) => {
  const prevButton = document.createElement('div');
  prevButton.className = 'swiper-button-prev !text-brand-dark';
  prevButton.style.color = '#002663';
  prevButton.style.left = '0px';
  prevButton.style.fontWeight = 'bold';
  // Use FontAwesome icons via class injection
  prevButton.innerHTML = `<i class="fas fa-chevron-left"></i>`;

  const nextButton = document.createElement('div');
  nextButton.className = 'swiper-button-next !text-brand-dark';
  nextButton.style.color = '#002663';
  nextButton.style.right = '0px';
  nextButton.style.fontWeight = 'bold';
  // Use FontAwesome icons via class injection
  nextButton.innerHTML = `<i class="fas fa-chevron-right"></i>`;

  outerWrapper.appendChild(prevButton);
  outerWrapper.appendChild(nextButton);
  
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    .swiper-button-prev::after,
    .swiper-button-next::after {
      display: none !important; /* Hide default Swiper arrows */
    }
    .swiper-button-prev, .swiper-button-next { 
      color: #002663 !important; 
      width: 40px !important;
      height: 40px !important;
    }
    /* Increase icon size */
    .swiper-button-prev i, .swiper-button-next i {
        font-size: 40px;
    }
    
    /* Responsive padding for wrapper */
    .swiper-outer-wrapper-v68 {
        padding-left: 50px;
        padding-right: 50px;
    }
    @media (max-width: 768px) {
        .swiper-outer-wrapper-v68 {
            padding-left: 30px;
            padding-right: 30px;
        }
        .swiper-button-prev i, .swiper-button-next i {
            font-size: 30px;
        }
    }
  `;
  outerWrapper.classList.add('swiper-outer-wrapper-v68');
  outerWrapper.appendChild(styleEl);
  
  return { prevButton, nextButton };
};
