import { GameObject, Piece } from "../interfaces/interfaces";
import { PiecePreview } from "./piecepreview";

interface NextPiecesProps {
    game: GameObject;
}
export function NextPieces({ game }: NextPiecesProps) {
    const nextPieces: Piece[] = game.nextPieces.slice(0, 4);

    return (
        <div className="flex flex-col gap-2">
            {nextPieces.map((piece, index) => (
                <div key={index} className="w-[6vw] h-[6vw] border">
                    <PiecePreview piece={piece} />
                </div>
            ))}
        </div>
    );
}