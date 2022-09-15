import React from "react";
import { MDBCarousel, MDBCarouselItem } from "mdb-react-ui-kit";
import "./carousel.scss";
import f9 from "../../images/f9.jpg";
import f10 from "../../images/f10.jpg";
import f12 from "../../images/f12.jpg";
import hot1 from "../../images/hot1.jpg";
import f7 from "../../images/f7.jpg";

export default function Carousel() {
  return (
    <div className="carousel-parent">
      <div className="carousel-div">
        <MDBCarousel showIndicators showControls fade>
          <MDBCarouselItem className="d-block" itemId={1} src={f9} alt="...">
            <h5>Užkandžiai</h5>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </MDBCarouselItem>
          <MDBCarouselItem className="d-block" itemId={2} src={f10} alt="...">
            <h5>Užkandžiai</h5>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </MDBCarouselItem>

          <MDBCarouselItem className="d-block" itemId={3} src={f12} alt="...">
            <h5>Užkandžiai</h5>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </MDBCarouselItem>
        </MDBCarousel>
        <div className="button-body" id="container">
          <button class="learn-more">
            <span class="circle" aria-hidden="true">
              <span class="icon arrow"></span>
            </span>
            <span class="button-text"> ŽIŪRĖTI MENIU</span>
          </button>
        </div>
      </div>
      <div className="carousel-div">
        <MDBCarousel showIndicators showControls fade>
          <MDBCarouselItem className="d-block" itemId={1} src={hot1} alt="...">
            <h5>PAGRINDINIAI</h5>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </MDBCarouselItem>
          <MDBCarouselItem className="d-block" itemId={2} src={f7} alt="...">
            <h5>PAGRINDINIAI</h5>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </MDBCarouselItem>

          <MDBCarouselItem
            className="d-block"
            itemId={3}
            src="https://mdbootstrap.com/img/Photos/Slides/img%20(40).jpg"
            alt="..."
          >
            <h5>PAGRINDINIAI</h5>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </MDBCarouselItem>
        </MDBCarousel>
        <div className="button-body" id="container">
          <button class="learn-more">
            <span class="circle" aria-hidden="true">
              <span class="icon arrow"></span>
            </span>
            <span class="button-text"> ŽIŪRĖTI MENIU</span>
          </button>
        </div>
      </div>
      <div className="carousel-div">
        <MDBCarousel showIndicators showControls fade>
          <MDBCarouselItem
            className="d-block"
            itemId={1}
            src="https://mdbootstrap.com/img/Photos/Slides/img%20(19).jpg"
            alt="..."
          >
            <h5>PAGRINDINIAI</h5>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </MDBCarouselItem>
          <MDBCarouselItem
            className="d-block"
            itemId={2}
            src="https://mdbootstrap.com/img/Photos/Slides/img%20(35).jpg"
            alt="..."
          >
            <h5>PAGRINDINIAI</h5>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </MDBCarouselItem>

          <MDBCarouselItem
            className="d-block"
            itemId={3}
            src="https://mdbootstrap.com/img/Photos/Slides/img%20(40).jpg"
            alt="..."
          >
            <h5>PAGRINDINIAI</h5>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </MDBCarouselItem>
        </MDBCarousel>
        <div className="button-body" id="container">
          <button class="learn-more">
            <span class="circle" aria-hidden="true">
              <span class="icon arrow"></span>
            </span>
            <span class="button-text"> ŽIŪRĖTI MENIU</span>
          </button>
        </div>
      </div>
    </div>
  );
}
