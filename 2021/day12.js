const myInput = `vp-BY
ui-oo
kk-IY
ij-vp
oo-start
SP-ij
kg-uj
ij-UH
SP-end
oo-IY
SP-kk
SP-vp
ui-ij
UH-ui
ij-IY
start-ui
IY-ui
uj-ui
kk-oo
IY-start
end-vp
uj-UH
ij-kk
UH-end
UH-kk`
  .split("\n")
  .map((line) => line.split("").map((num) => parseInt(num)));

const smallSampleInput = `start-A
start-b
A-c
A-b
b-d
A-end
b-end`
  .split("\n")
  .map((line) => line.split("-"));

// ---- Part 1 ----
console.log(smallSampleInput);
class PathBuilder {}
