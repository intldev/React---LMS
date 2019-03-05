import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import DropDownPage from "../../../../framework/author/itemList/questionType/fillInBlank/dropDownPage";

describe('Author - "Label Image with Drop Down" type question', () => {
  const queData = {
    group: "Fill in the Blanks",
    queType: "Label Image with Drop Down",
    queText: "Indian state known as garden spice is:",
    choices: ["ChoiceARes1", "ChoiceBRes1"],
    answerRes1: "ChoiceARes1",
    answerRes2: "ChoiceARes2",
    answerRes3: "ChoiceARes3",
    alterate: ["KL"],
    extlink: "www.testdomain.com",
    formattext: "formattedtext",
    formula: "s=ar^2",
    points: "2"
  };

  const question = new DropDownPage();
  const editItem = new EditItemPage();

  before(() => {
    cy.setToken();
  });

  context("User creates question.", () => {
    before("visit items page and select question type", () => {
      editItem.getItemWithId("5c358b480c8e6f22190d5ce0");
      editItem.deleteAllQuestion();
      // create new que and select type
      editItem.addNew().chooseQuestion(queData.group, queData.queType);
    });

    context("[Tc_383]:Tc_1 => Enter question text in Compose Question text box", () => {
      it("Write text in textbox", () => {
        question
          .getQuestionEditor()
          .clear()
          .type(queData.queText)
          .should("contain", queData.queText);
      });

      it("Upload image in the the textbox", () => {
        cy.fixture("testImages/sample.jpg").then(logo => {
          question.getQuestionEditor().clear();
          question.addImageOnEditor(logo);
          question.checkImageOnEditor();
        });
      });

      it("Give external link", () => {
        question
          .getQuestionEditor()
          .clear()
          .type(queData.formattext);

        question
          .getQuestionEditor()
          .find("p")
          .makeSelection();

        question.editToolBar.link().click();

        cy.focused()
          .clear()
          .type(queData.extlink)
          .type("{enter}");

        question
          .getQuestionEditor()
          .contains(queData.formattext)
          .should("have.attr", "href", queData.extlink);
      });

      it("Apply formating", () => {
        question
          .getQuestionEditor()
          .clear()
          .type(queData.formattext);

        question.formates.forEach(formate => {
          const text = queData.formattext;
          const { sel, tag } = formate;

          question
            .getQuestionEditor()
            .find("p")
            .makeSelection();

          question.editToolBar
            .stimulus()
            .find(sel)
            .click();

          question
            .getQuestionEditor()
            .contains(tag, text)
            .should("have.length", 1);

          question.editToolBar
            .stimulus()
            .find(sel)
            .click();

          question
            .getQuestionEditor()
            .find(tag)
            .should("not.be.exist");
        });
      });

      it("Insert formula", () => {
        question
          .getQuestionEditor()
          .clear()
          .type(queData.formula);

        question
          .getQuestionEditor()
          .find("p")
          .makeSelection();

        question.editToolBar.formula().click();

        cy.focused()
          .type(queData.formula)
          .type("{enter}");

        question
          .getQuestionEditor()
          .find(".ql-formula")
          .should("have.attr", "data-value", queData.formula);
      });
    });

    context("[Tc_384]:Tc_2 => Upload image", () => {
      it("Upload image to server", () => {
        cy.fixture("testImages/sample.jpg").then(logo => {
          Cypress.Blob.base64StringToBlob(logo, "image/jpg").then(blob => {
            cy.uploadImage(blob).then(result => {
              // update uploaded image link to store
              const imageUrl = result.response.body.result.fileUri;
              const currentQuestion = question.getCurrentStoreQuestion();
              currentQuestion.imageUrl = imageUrl;
              cy.window()
                .its("store")
                .invoke("dispatch", { type: "[author questions] update questions", payload: currentQuestion });
              cy.get('[data-cy="drag-drop-image-panel"] img').should("have.attr", "src", imageUrl);
            });
          });
        });

        // test with local image
        // const testImageUrl = 'https://edureact-dev.s3.amazonaws.com/1551154644960_blob';
        // const currentQuestion = question.getCurrentStoreQuestion()
        // currentQuestion.imageUrl = testImageUrl;
        // cy.window()
        //   .its('store')
        //   .invoke('dispatch', { type: '[author questions] update questions', payload: currentQuestion });
        // const img = Cypress.$('<img />', { src: testImageUrl });
        // cy.get('[data-cy="drag-drop-image-panel"]').then(($div) => {
        //   // append the image
        //   $div.append(img);
        // });
        // cy.get('[data-cy="drag-drop-image-panel"] img').click().should('have.attr', 'src', testImageUrl);
      });

      it("Width(px)", () => {
        question.changeImageWidth(queData.imageWidth);
        question.getImageWidth().should("have.attr", "width", queData.imageWidth);
      });

      it("Image alternative text", () => {
        question.inputImageAlternate(queData.imageAlternate);
        question.checkImageAlternate(queData.imageAlternate);
      });

      it("Fill color", () => {
        question.updateColorPicker(queData.testColor);
        question.getAllInputPanel().each($el => {
          cy.wrap($el).should("have.attr", "background", queData.testColor);
        });
      });

      it("Maximum responses per container", () => {
        question
          .getMaxResponseInput()
          .click()
          .clear()
          .type(queData.maxRes)
          .should("have.value", queData.maxRes);
      });

      it("Edit ARIA labels", () => {
        question
          .getAriaLabelCheck()
          .click()
          .find("input")
          .should("be.checked");

        cy.get("body")
          .find(".iseditablearialabel")
          .should("be.visible");

        question
          .getAriaLabelCheck()
          .click()
          .find("input")
          .should("not.be.checked");

        cy.get("body")
          .find(".iseditablearialabel")
          .should("not.be.visible");
      });
    });

    context("[Tc_385]:Tc_3 => Response", () => {
      for (let i = 0; i < 3; i++) {
        context(`Response ${i + 1}`, () => {
          it("Add new choices", () => {
            queData.choices.forEach((ch, index) => {
              question
                .addNewChoiceOnResponse(i)
                .getChoiceByIndexRes(i, index)
                .clear()
                .type(ch)
                .should("have.value", ch);
              // check added answers
              question.checkAddedAnswersRes(i, ch);
            });
          });

          it("Delete Choices", () => {
            question
              .getAllChoicesRes(i)
              .each(($el, index, $list) => {
                const cusIndex = $list.length - (index + 1);
                question.deleteChoiceIndexRes(i, cusIndex);
              })
              .should("have.length", 0);
          });

          it("Add Sample test choices", () => {
            queData.choices.forEach((ch, index) => {
              question
                .addNewChoiceOnResponse(i)
                .getChoiceByIndexRes(i, index)
                .clear()
                .type(ch)
                .should("have.value", ch);
              // check added answers
              question.checkAddedAnswersRes(i, ch);
            });
          });
        });
      }

      it("Edit default text", () => {
        question
          .addNewChoiceOnResponse(0)
          .getChoiceByIndexRes(0, 0)
          .click()
          .should("have.value", "");
      });
    });

    context("[Tc_386]:Tc_4 => Set Correct Answer(s)", () => {
      it("Update points", () => {
        question
          .getPointsEditor()
          .clear()
          .type(`${queData.points}`)
          .should("have.value", queData.points)
          .type("{uparrow}")
          .type("{uparrow}")
          .should("have.value", `${Number(queData.points) + 1}`);
      });

      it("Select the responses from drop down", () => {
        question.setAnswerOnBoard(0, 0);
        question.setAnswerOnBoard(1, 0);
        question.setAnswerOnBoard(2, 0);
      });

      it("Add/Delete alternatives", () => {
        question.addAlternate();
        question.checkAndDeleteAlternates();
      });

      it("Check/uncheck Shuffle Possible responses", () => {
        question
          .getShuffleDropDown()
          .click()
          .find("input")
          .should("be.checked");

        question.getDropDownByRes(0).click();

        queData.choices.forEach(ch => {
          question.checkShuffled(0, ch);
        });

        question.getDropDownByRes(0).click();

        question
          .getShuffleDropDown()
          .click()
          .find("input")
          .should("not.be.checked");
      });
    });

    context("[Tc_387]:Tc_5 => Save Question", () => {
      it("Click on save button", () => {
        question.header.save();
        cy.url().should("contain", "item-detail");
      });
    });

    context("[Tc_388]:Tc_6 => Preview items", () => {
      it("Click on Preview, CheckAnswer", () => {
        const preview = editItem.header.preview();

        question.setAnswerOnBoard(0, 0);
        question.setAnswerOnBoard(1, 0);
        question.setAnswerOnBoard(2, 0);

        preview
          .getCheckAnswer()
          .click()
          .then(() => {
            cy.get("body")
              .children()
              .should("contain", "score: 3/3");
          });
      });

      it("Click on ShowAnswer", () => {
        const preview = editItem.header.preview();
        preview.getClear().click();

        preview.getShowAnswer().click();
      });

      it("Click on Clear, Edit", () => {
        const preview = editItem.header.preview();
        preview.getClear().click();

        preview.header.edit();
      });
    });
  });

  context("Edit the question created", () => {
    before("delete old question and create dummy que to edit", () => {
      editItem.getItemWithId("5c358b480c8e6f22190d5ce0");
      editItem.deleteAllQuestion();

      // create new que and select type
      editItem.addNew().chooseQuestion(queData.group, queData.queType);
      question.header.save();
      // edit
      editItem.getEditButton().click();
    });

    context("[Tc_389]:Tc_1 => Enter question text in Compose Question text box", () => {
      it("Write text in textbox", () => {
        question
          .getQuestionEditor()
          .clear()
          .type(queData.queText)
          .should("contain", queData.queText);
      });

      it("Upload image in the the textbox", () => {
        it("Upload image in the the textbox", () => {
          cy.fixture("testImages/sample.jpg").then(logo => {
            question.getQuestionEditor().clear();
            question.addImageOnEditor(logo);
            question.checkImageOnEditor();
          });
        });
      });

      it("Give external link", () => {
        question
          .getQuestionEditor()
          .clear()
          .type(queData.formattext);

        question
          .getQuestionEditor()
          .find("p")
          .makeSelection();

        question.editToolBar.link().click();

        cy.focused()
          .clear()
          .type(queData.extlink)
          .type("{enter}");

        question
          .getQuestionEditor()
          .contains(queData.formattext)
          .should("have.attr", "href", queData.extlink);
      });

      it("Apply formating", () => {
        question
          .getQuestionEditor()
          .clear()
          .type(queData.formattext);

        question.formates.forEach(formate => {
          const text = queData.formattext;
          const { sel, tag } = formate;

          question
            .getQuestionEditor()
            .find("p")
            .makeSelection();

          question.editToolBar
            .stimulus()
            .find(sel)
            .click();

          question
            .getQuestionEditor()
            .contains(tag, text)
            .should("have.length", 1);

          question.editToolBar
            .stimulus()
            .find(sel)
            .click();

          question
            .getQuestionEditor()
            .find(tag)
            .should("not.be.exist");
        });
      });

      it("Insert formula", () => {
        question
          .getQuestionEditor()
          .clear()
          .type(queData.formula);

        question
          .getQuestionEditor()
          .find("p")
          .makeSelection();

        question.editToolBar.formula().click();

        cy.focused()
          .type(queData.formula)
          .type("{enter}");

        question
          .getQuestionEditor()
          .find(".ql-formula")
          .should("have.attr", "data-value", queData.formula);
      });
    });

    context("[Tc_390]:Tc_2 => Upload image", () => {
      it("Upload image to server", () => {
        // test with local image
        // const testImageUrl = 'https://edureact-dev.s3.amazonaws.com/1551154644960_blob';
        // const currentQuestion = question.getCurrentStoreQuestion()
        // currentQuestion.imageUrl = testImageUrl;
        // cy.window()
        //   .its('store')
        //   .invoke('dispatch', { type: '[author questions] update questions', payload: currentQuestion });
        // const img = Cypress.$('<img />', { src: testImageUrl });
        // cy.get('[data-cy="drag-drop-image-panel"]').then(($div) => {
        //   // append the image
        //   $div.append(img);
        // });
        // cy.get('[data-cy="drag-drop-image-panel"] img').click().should('have.attr', 'src', testImageUrl);
      });

      it("Width(px)", () => {
        question.changeImageWidth(queData.imageWidth);
        question.getImageWidth().should("have.attr", "width", queData.imageWidth);
      });

      it("Image alternative text", () => {
        question.inputImageAlternate(queData.imageAlternate);
        question.checkImageAlternate(queData.imageAlternate);
      });

      it("Fill color", () => {
        question.updateColorPicker(queData.testColor);
        question.getAllInputPanel().each($el => {
          cy.wrap($el).should("have.attr", "background", queData.testColor);
        });
      });

      it("Maximum responses per container", () => {
        question
          .getMaxResponseInput()
          .click()
          .clear()
          .type(queData.maxRes)
          .should("have.value", queData.maxRes);
      });

      it("Edit ARIA labels", () => {
        question
          .getAriaLabelCheck()
          .click()
          .find("input")
          .should("be.checked");

        cy.get("body")
          .find(".iseditablearialabel")
          .should("be.visible");

        question
          .getAriaLabelCheck()
          .click()
          .find("input")
          .should("not.be.checked");

        cy.get("body")
          .find(".iseditablearialabel")
          .should("not.be.visible");
      });
    });

    context("[Tc_391]:Tc_3 => Edit Response", () => {
      for (let i = 0; i < 3; i++) {
        context(`Response ${i + 1}`, () => {
          it("Add new choices", () => {
            queData.choices.forEach((ch, index) => {
              question
                .addNewChoiceOnResponse(i)
                .getChoiceByIndexRes(i, index)
                .clear()
                .type(ch)
                .should("have.value", ch);
              // check added answers
              question.checkAddedAnswersRes(i, ch);
            });
          });

          it("Delete Choices", () => {
            question
              .getAllChoicesRes(i)
              .each(($el, index, $list) => {
                const cusIndex = $list.length - (index + 1);
                question.deleteChoiceIndexRes(i, cusIndex);
              })
              .should("have.length", 0);
          });

          it("Add Sample test choices", () => {
            queData.choices.forEach((ch, index) => {
              question
                .addNewChoiceOnResponse(i)
                .getChoiceByIndexRes(i, index)
                .clear()
                .type(ch)
                .should("have.value", ch);
              // check added answers
              question.checkAddedAnswersRes(i, ch);
            });
          });
        });
      }

      it("Edit default text", () => {
        question
          .addNewChoiceOnResponse(0)
          .getChoiceByIndexRes(0, 0)
          .click()
          .should("have.value", "");
      });
    });

    context("[Tc_392]:Tc_4 => Set Correct Answer(s)", () => {
      it("Update points", () => {
        question
          .getPointsEditor()
          .clear()
          .type(`${queData.points}`)
          .should("have.value", queData.points)
          .type("{uparrow}")
          .type("{uparrow}")
          .should("have.value", `${Number(queData.points) + 1}`);
      });

      it("Select the responses from drop down", () => {
        question.setAnswerOnBoard(0, 0);
        question.setAnswerOnBoard(1, 0);
        question.setAnswerOnBoard(2, 0);
      });

      it("Add/Delete alternatives", () => {
        question.addAlternate();
        question.checkAndDeleteAlternates();
      });
    });

    context("[Tc_393]:Tc_5 => Save questions", () => {
      it("Click on save button", () => {
        question.header.save();
        cy.url().should("contain", "item-detail");
      });
    });

    context("[Tc_394]:Tc_6 => Preview items", () => {
      it("Click on Preview, CheckAnswer", () => {
        const preview = editItem.header.preview();

        question.setAnswerOnBoard(0, 0);
        question.setAnswerOnBoard(1, 0);
        question.setAnswerOnBoard(2, 0);

        preview
          .getCheckAnswer()
          .click()
          .then(() => {
            cy.get("body")
              .children()
              .should("contain", "score: 3/3");
          });
      });

      it("Click on ShowAnswer", () => {
        const preview = editItem.header.preview();
        preview.getClear().click();

        preview.getShowAnswer().click();
      });

      it("Click on Clear, Edit", () => {
        const preview = editItem.header.preview();
        preview.getClear().click();

        preview.header.edit();
      });
    });
  });

  context("Delete the question after creation", () => {
    context("[Tc_395]:Tc_1 => Delete option", () => {
      it("Click on delete button in Item Details page", () => {
        editItem
          .getDelButton()
          .should("have.length", 1)
          .click()
          .should("have.length", 0);
      });
    });
  });
});
