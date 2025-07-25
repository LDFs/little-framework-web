function createShader(gl: WebGLRenderingContext, type: GLenum, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw("*** Error: shader 设置失败！");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("编译着色器时发生错误：" + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) {
  // 创建一个程序对象
  const program = gl.createProgram();
  // 将着色器附加到程序上
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // 链接一个程序对象
  gl.linkProgram(program);
  // 将指定的程序设置为当前渲染状态的一部分
  gl.useProgram(program);

  return program;
}

function createProgramFromScripts(
  gl: WebGLRenderingContext,
  sourceV: string,
  sourceF: string
) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, sourceV);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, sourceF);
  if (!vertexShader || !fragmentShader) throw("*** Error: shader 设置失败！");

  return createProgram(gl, vertexShader, fragmentShader);
}

/**
 * 处理通过style改变画布显示大小时的画面失真情况
 */
function resizeCanvasToMatchDisplaySize(canvas: HTMLCanvasElement) {
  // 获取浏览器中画布的显示尺寸
  var displayWidth  = canvas.clientWidth;
  var displayHeight = canvas.clientHeight;
 
  // 检尺寸是否相同
  if (canvas.width  != displayWidth ||
      canvas.height != displayHeight) {
 
    // 设置为相同的尺寸
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
  }
}

export { createProgramFromScripts, resizeCanvasToMatchDisplaySize };
