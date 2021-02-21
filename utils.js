
// Python's list comprehension
function listComp(iterable, selector)
{
    let li = [];
    for (let x of iterable)
        li.push(selector(x));
    return li;
}
