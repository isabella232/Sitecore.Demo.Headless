import React from "react";
import { Image, Text, RichText, DateField } from "@sitecore-jss/sitecore-jss-react";
import { NavLink } from "react-router-dom";
import { translate } from "react-i18next";
import EventLabels from '../EventLabels';

const EventListItem = ({ label, fields, url, featured, t }) => {
  return (
    <React.Fragment>
      <div className={`events-item ${featured ? "events-item_featured" : ""}`}>
        <div className="events-item-image-container">
          <div className="events-item-image">
            <NavLink to={`${url}`}>
              <Image
                field={fields.image}
                srcSet={[{ mw: 650 }, { mw: 350 }]}
                sizes="(min-width: 960px) 650px, 350px"
                width={null}
                height={null}
              />
            </NavLink>
          </div>
          <div className="events-item-image-overlay">
            <div className="events-item-image-overlay-content">
              <div className="events-item-metas">
                {featured && (
                  <Text
                    field={label}
                    tag="p"
                    className="events-item-meta events-item-meta_recommended"
                  />
                )}
                <EventLabels labels={fields.labels} className="events-item-meta events-item-meta_type ico" />
              </div>
            </div>
          </div>
        </div>
        <div className="events-item-content">
          <div className="events-item-content-inner">
            <NavLink to={`${url}`} className="events-item-name-link">
              <Text field={fields.name} tag="h5" className="events-item-name" />
            </NavLink>
            <DateField field={fields.date} tag="p" className="events-item-date" render={(date) => date.toLocaleString()} />
            <RichText
              field={fields.description}
              tag="p"
              className="events-item-name-description"
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default translate()(EventListItem);
