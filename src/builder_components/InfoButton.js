import React from 'react';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Badge from 'react-bootstrap/Badge';

const InfoButton = ({ title, content }) => {
  const popover = (
    <Popover id="popover-basic">
      <Popover.Title as="h3">{title}</Popover.Title>
      <Popover.Content>
        {content}
      </Popover.Content>
    </Popover>
  );
  return (
    <OverlayTrigger trigger="click" placement="right" overlay={popover}>
      <span className="info-wrapper">
        <Badge pill variant="secondary">
          ?
        </Badge>
      </span>
    </OverlayTrigger>
  );
}

export default InfoButton;
