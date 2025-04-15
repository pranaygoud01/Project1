

const Modal=({ product, onClose,locale })=> {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>X</button>
                <img 
                    src={`http://localhost:8080${product.image}`} 
                    alt={product.name} 
                    className="modal-image" 
                />
                <div className="details w-100 bg-light px-5">
                    <h2>{product.name}</h2>
                    <p>{product.description}</p>
                    <p>Price: {locale} {product.price}</p>
                    <p>Quantity: {product.quantity}</p>
                    {product.hold && <p className="hold">On Hold</p>}
                </div>
            </div>
        </div>
    );  
}
export default Modal;