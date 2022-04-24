export function countVotes(options) {
    let votes = 0;
    options.map((option) => {
        votes += option.votes
    })
    return votes
}