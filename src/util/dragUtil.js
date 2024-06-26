export let mousePosition;
export let dragging = false;
export let crop_pos = { x: 0, y: 0 };

let imgBox_rect = { w: 0, h: 0 };
let cropBox_rect = { w: 0, h: 0 };
// var

export const startDragging = (
  event,
  imgBox,
  cropBox,
  dragCropBox,
  stopDragging
) => {
  dragging = true;
  mousePosition = {
    x: event.clientX || event.touches[0].clientX,
    y: event.clientY || event.touches[0].clientY,
  };

  imgBox_rect.w = imgBox.width;
  imgBox_rect.h = imgBox.height;

  cropBox_rect.w = cropBox.width;
  cropBox_rect.h = cropBox.height;

//   console.log(cropBox_rect, imgBox_rect);

  document.addEventListener("mousemove", dragCropBox);
  document.addEventListener("touchmove", dragCropBox);
  document.addEventListener("mouseup", stopDragging);
  document.addEventListener("touchend", stopDragging);
};

export const dragCropBox = (event, context) => {
  if (!dragging) return;
//   const clientX = event.clientX || event.touches[0].clientX;
//   const clientY = event.clientY || event.touches[0].clientY;
    const clientX = event.clientX;
  const clientY = event.clientY;
  const deltaX = clientX - mousePosition.x;
  const deltaY = clientY - mousePosition.y;

  crop_pos.x += deltaX;
  crop_pos.y += deltaY;

  // Constrain the crop box within the image box
  crop_pos.x = Math.max(
    0,
    Math.min(crop_pos.x, imgBox_rect.w - cropBox_rect.w)
  );
  crop_pos.y = Math.max(
    0,
    Math.min(crop_pos.y, imgBox_rect.h - cropBox_rect.h)
  );

  mousePosition.x = clientX;
  mousePosition.y = clientY;

  context.c_position.x = crop_pos.x;
  context.c_position.y = crop_pos.y;

  console.log(crop_pos);
};

export const stopDragging = (dragCropBox, stopDragging) => {
  dragging = false;
  document.removeEventListener("mousemove", dragCropBox);
  document.removeEventListener("touchmove", dragCropBox);
  document.removeEventListener("mouseup", stopDragging);
  document.removeEventListener("touchend", stopDragging);
};
