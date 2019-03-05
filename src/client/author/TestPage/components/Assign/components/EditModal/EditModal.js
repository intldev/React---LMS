import React, { useState } from "react";
import produce from "immer";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Col, Icon } from "antd";
import { cloneDeep as _cloneDeep, uniq as _uniq, curry as _curry } from "lodash";
import { SettingsBtn, StyledRowLabel, ModalWrapper, InitOptions } from "./styled";
import ClassSelector from "./ClassSelector";
import StudentSelector from "./StudentSelector";
import DateSelector from "./DateSelector";
import PolicySelector from "./PolicySelector";
import Footer from "./Footer";
import { selectsData } from "../../../common";
import { fetchGroupMembersAction, getStudentsSelector } from "../../../../../sharedDucks/groups";
import { getCurrentAssignmentSelector, saveAssignmentAction } from "../../ducks";
import Settings from "./Settings";
import { getListOfStudents } from "../../utils";

const EditModal = ({ title, visible, onCancel, onOk, modalData, group, students, fetchStudents, saveAssignment }) => {
  let [showSettings, setSettings] = useState(false);
  let [assignment, updateAssignment] = useState(modalData);

  // toggle advanced settings
  const toggleSettings = () => setSettings(prev => !prev);

  // on change of assignment fields
  const onChange = (field, value) => {
    const nextState = produce(assignment, state => {
      state[field] = value;
    });
    updateAssignment(nextState);
  };
  const changeField = _curry(onChange);

  const updateStudents = studentList => {
    onChange("students", studentList);
  };

  // save the assingment and close the modal
  const addAssignment = () => {
    // We want the ability to override onOk logic of the component so
    // if we supply the component onOK callback prop,
    // use that instead of the components handlers
    if (onOk) {
      onOk();
      return;
    }

    saveAssignment(assignment);
    onCancel();
  };

  const studentOfSelectedClass = getListOfStudents(students, assignment.class);
  const setList = studentOfSelectedClass.map(item => item._id);
  const selectedStudents = assignment.students && assignment.students.filter(id => setList.includes(id));

  const disabled = assignment.specificStudents
    ? !selectedStudents || selectedStudents.length == 0
    : !assignment.class.length;

  return (
    <ModalWrapper
      data-cy="title"
      title={title}
      visible={visible}
      footer={<Footer onOk={addAssignment} onCancel={onCancel} disabled={disabled} />}
      onCancel={onCancel}
      width="50%"
    >
      <InitOptions>
        <ClassSelector
          onChange={changeField("class")}
          fetchStudents={fetchStudents}
          selectedGroups={assignment.class}
          group={group}
        />
        <StudentSelector
          studentNames={selectedStudents}
          students={studentOfSelectedClass}
          updateStudents={updateStudents}
          onChange={onChange}
          specificStudents={assignment.specificStudents}
        />

        <DateSelector startDate={assignment.startDate} endDate={assignment.endDate} changeField={changeField} />

        <PolicySelector
          openPolicy={assignment.openPolicy}
          closePolicy={assignment.closePolicy}
          changeField={changeField}
        />
      </InitOptions>
      <StyledRowLabel gutter={16}>
        <Col>
          <SettingsBtn onClick={toggleSettings} isVisible={showSettings}>
            OVERRIDE TEST SETTINGS {showSettings ? <Icon type="up" /> : <Icon type="down" />}
          </SettingsBtn>
        </Col>
      </StyledRowLabel>

      {showSettings && <Settings modalData={modalData} onChange={onChange} selectsData={selectsData} />}
    </ModalWrapper>
  );
};

EditModal.propTypes = {
  students: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  onOk: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
  modalData: PropTypes.object.isRequired,
  group: PropTypes.array.isRequired,
  fetchStudents: PropTypes.func.isRequired
};

EditModal.defaultProps = {
  onOk: null
};

export default connect(
  state => ({
    students: getStudentsSelector(state),
    modalData: getCurrentAssignmentSelector(state)
  }),
  {
    fetchStudents: fetchGroupMembersAction,
    saveAssignment: saveAssignmentAction
  }
)(EditModal);
