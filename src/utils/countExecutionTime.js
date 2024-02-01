const countExecutionTime = (startTime = Date.now()) => {
    const endTime = Date.now();
    return endTime - startTime || 0;
};

export default countExecutionTime;