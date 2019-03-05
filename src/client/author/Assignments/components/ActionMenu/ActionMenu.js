/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Menu } from "antd";
import simpleIcon from "../../assets/icon.svg";
import classIcon from "../../assets/manage-class.svg";
import copyItem from "../../assets/copy-item.svg";
import viewIcon from "../../assets/view.svg";
import infomationIcon from "../../assets/information.svg";
import responsiveIcon from "../../assets/responses.svg";
import toolsIcon from "../../assets/printing-tool.svg";
import devIcon from "../../assets/dev.svg";
import googleIcon from "../../assets/Google Classroom.svg";

import { Container, StyledMenu, StyledLink, SpaceElement } from "./styled";

class ActionMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  render() {
    const MenuItems = [];
    MenuItems.push(
      <Menu.Item>
        <StyledLink target="_blank" rel="noopener noreferrer">
          <img alt="icon" src={simpleIcon} />
          <SpaceElement />
          Add/Edit Assignment
        </StyledLink>
      </Menu.Item>
    );
    MenuItems.push(
      <Menu.Item>
        <StyledLink target="_blank" rel="noopener noreferrer">
          <img alt="icon" src={classIcon} />
          <SpaceElement />
          Edit Assessment
        </StyledLink>
      </Menu.Item>
    );
    MenuItems.push(
      <Menu.Item>
        <StyledLink target="_blank" rel="noopener noreferrer">
          <img alt="icon" src={copyItem} />
          <SpaceElement />
          Duplicate
        </StyledLink>
      </Menu.Item>
    );
    MenuItems.push(
      <Menu.Item>
        <StyledLink target="_blank" rel="noopener noreferrer">
          <img alt="icon" src={viewIcon} />
          <SpaceElement />
          Preview
        </StyledLink>
      </Menu.Item>
    );
    MenuItems.push(
      <Menu.Item>
        <StyledLink target="_blank" rel="noopener noreferrer">
          <img alt="icon" src={infomationIcon} />
          <SpaceElement />
          View Details
        </StyledLink>
      </Menu.Item>
    );
    MenuItems.push(
      <Menu.Item>
        <StyledLink target="_blank" rel="noopener noreferrer">
          <img alt="icon" src={responsiveIcon} />
          <SpaceElement />
          Responses
        </StyledLink>
      </Menu.Item>
    );
    MenuItems.push(
      <Menu.Item>
        <StyledLink target="_blank" rel="noopener noreferrer">
          <img alt="icon" src={toolsIcon} />
          <SpaceElement />
          Print
        </StyledLink>
      </Menu.Item>
    );
    MenuItems.push(
      <Menu.Item>
        <StyledLink target="_blank" rel="noopener noreferrer">
          <img alt="icon" src={devIcon} />
          <SpaceElement />
          Embed
        </StyledLink>
      </Menu.Item>
    );
    MenuItems.push(
      <Menu.Item>
        <StyledLink target="_blank" rel="noopener noreferrer">
          <img alt="icon" src={googleIcon} />
          <SpaceElement />
          GClassroom
        </StyledLink>
      </Menu.Item>
    );
    return (
      <Container>
        <StyledMenu>{MenuItems}</StyledMenu>
      </Container>
    );
  }
}

export default ActionMenu;
