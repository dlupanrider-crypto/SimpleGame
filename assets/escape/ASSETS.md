# 准点撤离：素材记录

参考图：`docs/features/active/pingan-monopoly/assets/office-escape-multifloor-concept.png`。以下图片由 Codex 内置 imagegen 根据参考图生成，项目使用本地文件，不依赖线上 CDN。

| 文件 | 用途 | 生成提示摘要 |
| --- | --- | --- |
| `city-sunset-v1.png` | 游戏背景 | 参考图的暖色高层办公室日落城市景观，背景虚化，无界面和文字。 |
| `office-floor-v1.png` | 办公室地面贴图 | 暖灰米色细颗粒石材，均匀光照、无网格和透视，可重复铺设。 |
| `office-worker-v1.png` | 真人席位与地图角色 | 黑发、衬衫、深绿外套及斜挎包的微缩职场角色，透明背景。 |
| `office-robot-v1.png` | 机器人席位与地图角色 | 白色圆角头、青色眼睛、深青机身的微缩机器人，透明背景。 |
| `workstation-v1.png` | 办公工位装饰 | 两个带隔板的木色办公桌、显示器、办公椅、文件和绿植，暖色微缩场景，透明背景。 |
| `meeting-table-v1.png` | 会议区装饰 | 木质会议桌、四把椅子、电脑、笔记本和绿植，暖色微缩场景，透明背景。 |
| `lounge-v1.png` | 休息区装饰 | 绿色沙发、橙色单人椅、圆茶几和绿植，暖色微缩场景，透明背景。 |
| `pantry-v1.png` | 茶水间装饰 | 微缩茶水柜、咖啡机、茶杯、圆桌和绿植，暖色微缩场景，透明背景。 |
| `glass-room-v1.png` | 历史会议室方案素材，当前未在地图使用 | 黑色金属玻璃隔断、木质会议桌、椅子和植物，暖色微缩场景，透明背景。 |
| `executive-office-v1.png` | 办公室装饰 | 木质办公桌、书架、皮椅和台灯，暖色微缩场景，透明背景。 |
| `plant-v1.png` | 办公楼绿植 | 微缩龟背竹、米色陶盆及暖色日光，透明背景。 |
| `elevator-v1.png` | 电梯装饰 | 深铜色门框、金属双开门、楼层按钮及顶部暖灯，透明背景。 |

工位使用 `models/workstation-v2.glb` 三维模型，由 `models/workstation_source.py` 在 Blender 中生成并导出；模型和 Three.js GLTFLoader 均随扩展打包，可离线加载。模型加载失败时先回退到工位图片，图片也失败时回退到程序化几何体。会议室隔断和家具由 Three.js 几何体绘制。角色和其他部分家具仍以面向镜头的透明图片放置在 Three.js 场景中；角色拥有真实地图位置和移动过渡，但图片并非可从任意角度观察的三维模型。场景主体和可交互格子由 Three.js 绘制。Three.js 及其加载器的许可见 `vendor/three/LICENSE`。

## 内置 imagegen 提示词

每次生成均以本文开头的设计图为风格参考；除城市背景和地面外，其余请求透明背景。

- 城市背景：`Use case: stylized-concept. Asset type: full-bleed game environment background behind an interactive 3D scene. Use the supplied image as visual style reference only: a warmly sunlit, softly blurred city office skyline seen from a high-rise at golden hour, soft orange sun glow, miniature diorama game rendering aesthetic, photographic depth-of-field. Show distant skyscrapers, soft warm sky, a darkened desk edge and a few blurred plant leaves at edges; keep center unobtrusive to support an overlaid 3D office. Landscape 16:9. No game board, no characters, no foreground office model, no interface, no letters, no typography, no logos.`
- 地面：`Use case: stylized-concept. Asset: seamless PBR base-color texture for a miniature office board game, matching the warm, detailed 3D office in the supplied reference. Create a straight-on square, uniformly lit grey-beige polished stone / soft concrete surface with subtle natural speckles, slight worn edges and delicate mottling, elegant and understated. No grid, no grout, no objects, no text, no directional shadows; tileable on all edges. The same material will be used on each game board square, so no perspective.`
- 真人：`A single cute miniature Chinese office worker game character, black hair, pale shirt with dark green jacket, small messenger bag, friendly expressive face, full body standing, three-quarter view. Stylized high quality 3D toy character like the reference game. Isolated asset, centered, complete silhouette, transparent background. No props apart from bag, no typography, no frame, no shadow beyond feet.`
- 机器人：`A single cute miniature robot game character with cream white rounded square head, dark face screen, two cyan glowing eyes, small antenna, dark teal and white compact body, full body standing, three-quarter view. Stylized high quality 3D toy character like the reference game. Isolated asset, centered, complete silhouette, transparent background. No extra objects, no typography, no frame, no ground.`
- 工位：`A compact miniature office workstation cluster for an isometric 3D board-game scene: two cream and warm wood desks with short fabric dividers, two black chairs, two widescreen monitors, keyboard, mug, a small stack of paper, tiny potted plant. Shown from an elevated three-quarter angle, detailed cozy toy-like 3D render with warm sunset lighting, matching the provided reference image. Isolated complete object on transparent background. No room, no floor plane, no text, no people, no frame, no logo, no white backdrop.`
- 会议桌：`A compact miniature office meeting table furniture cluster for an isometric 3D board-game scene: light wood rectangular table, four dark office chairs, laptops, notebooks and a tiny potted plant. Shown from an elevated three-quarter angle, detailed cozy toy-like 3D render with warm sunset lighting, matching the provided reference image. Isolated complete furniture on transparent background. No room, no floor plane, no text, no people, no frame, no logo, no white backdrop.`
- 休息区：`A compact miniature office lounge furniture cluster for an isometric 3D board-game scene: one moss-green fabric sofa, a warm orange armchair, small round coffee table and leafy potted plant. Shown from an elevated three-quarter angle, detailed cozy toy-like 3D render with warm sunset lighting, matching the provided reference image. Isolated complete furniture on transparent background. No room, no floor plane, no text, no people, no frame, no logo, no white backdrop.`
- 茶水间：`An isolated miniature office pantry furniture vignette for a warm isometric 3D board game, including a cream wood kitchenette cabinet, coffee machine, cups, tiny microwave, small round cafe table and leafy plant. Elevated three-quarter angle, detailed realistic toy-diorama rendering and golden hour light like the reference. Transparent background, complete freestanding objects. No text, no people, no walls beyond furniture, no watermark, no white ground.`
- 玻璃会议室：`An isolated miniature glass meeting-room vignette for a warm isometric 3D board game: slender black metal framed glass walls enclosing a light wood conference table, black chairs, laptop, paperwork and a plant, with an open front so the contents are visible. Elevated three-quarter view, high-detail toy-diorama rendering and golden hour light matching the reference. Transparent background; no surrounding building or people, no text, no watermark, no white ground.`
- 办公室：`An isolated miniature executive-office furniture vignette for a warm isometric 3D board game: a rich wood desk, desktop monitor, leather office chair, tall bookshelf with books and leafy plant, a warm desk lamp. Elevated three-quarter view, high-detail toy-diorama rendering and warm sunset light matching the reference. Transparent background; complete vignette only, no person, no walls, no text, no watermark, no white ground.`
- 绿植：`An isolated full miniature office potted plant for an isometric 3D board game: lush realistic green monstera leaves, a neat small warm beige ceramic planter, warm golden hour illumination. Elevated three-quarter view, high-detail toy diorama, style matching the provided office game reference. Transparent background, complete plant, no people, no floor, no text, no watermark.`
- 电梯：`An isolated miniature office elevator doorway for an isometric 3D board game: dark bronze surround, closed brushed-metal double doors, a small glowing call button, warm overhead light. Elevated three-quarter view, high-detail toy diorama, style matching the supplied office game reference. Transparent background, complete doorway, no people, no room, no text, no watermark.`
