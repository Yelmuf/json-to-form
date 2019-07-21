export const testId = {
  form: 'form',
  submitResult: 'submit-result',
};

const injectAsAttribute = value => ({
  'data-testid': testId[value]
});

export default Object.keys(testId).reduce(
  (acc, id) => ({
    ...acc,
    [id]: injectAsAttribute(id)
  }),
  {}
);
